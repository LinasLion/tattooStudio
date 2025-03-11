const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const {authenticate} = require("./auth");
const Gallery = require('../models/gallery');

/**
 * Configure multer storage for gallery images
 * - Saves files to uploads/gallery directory
 * - Creates directory if it doesn't exist
 * - Generates unique filenames with timestamps
 */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '..', 'uploads', 'gallery');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, {recursive: true});
        }
        cb(null, uploadDir);
    }, filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

/**
 * Configure multer with storage, file filter, and size limits
 * - Only allows image files
 * - Sets 5MB size limit
 */
const upload = multer({
    storage: storage, limits: {fileSize: 5 * 1024 * 1024}, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

/**
 * Helper function to process photo image to base64
 * @param {Object} photo - The photo document from database
 * @returns {Object} Processed photo with imageBlob added
 */
const processPhotoImage = async (photo) => {
    const photoObj = photo.toObject();

    if (photo.image) {
        try {
            const imagePath = path.resolve(__dirname, '..', photo.image);

            if (fs.existsSync(imagePath)) {
                const imageData = fs.readFileSync(imagePath);
                photoObj.imageBlob = imageData.toString('base64');
            } else {
                console.error(`Image file not found: ${imagePath}`);
                photoObj.imageBlob = null;
            }
        } catch (error) {
            console.error(`Error reading image file: ${photo.image}`, error);
            photoObj.imageBlob = null;
        }
    }

    return photoObj;
};

/**
 * Helper function to delete a file with error handling
 * @param {string} filePath - Path to the file to delete
 */
const deleteFile = (filePath) => {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log('File deleted successfully:', filePath);
        } else {
            console.log('File not found, skipping delete:', filePath);
        }
    } catch (error) {
        console.error(`Error deleting file: ${filePath}`, error);
    }
};

/**
 * GET /gallery
 * Retrieves all photos sorted by creation date (newest first)
 * Includes base64-encoded images
 */
router.get('/', async (req, res) => {
    console.log("GET /gallery");
    try {
        const photos = await Gallery.find().sort({createdAt: -1});

        const photosWithImages = await Promise.all(photos.map(processPhotoImage));

        res.json(photosWithImages);
    } catch (error) {
        console.error('Error fetching photos:', error);
        res.status(500).json({
            message: 'Failed to fetch photos', error: error.message
        });
    }
});

/**
 * POST /gallery
 * Creates a new photo entry with uploaded image
 * Requires authentication
 */
router.post('/', authenticate, upload.single('image'), async (req, res) => {
    console.log("POST /gallery");
    try {
        if (!req.file) {
            return res.status(400).json({message: 'Image file is required'});
        }

        const relativePath = req.file.path.replace(path.resolve(__dirname, '..') + '/', '');

        const newPhoto = new Gallery({
            title: req.body.title || '', image: relativePath,
        });

        const savedPhoto = await newPhoto.save();
        console.log('Saved photo:', savedPhoto._id);

        const photoObj = await processPhotoImage(savedPhoto);

        res.status(201).json(photoObj);
    } catch (error) {
        console.error('Error creating photo:', error);

        if (req.file && req.file.path) {
            deleteFile(req.file.path);
        }

        res.status(500).json({
            message: 'Failed to create photo', error: error.message
        });
    }
});

/**
 * DELETE /gallery/:id
 * Deletes a photo and its associated image file
 * Requires authentication
 */
router.delete('/:id', authenticate, async (req, res) => {
    console.log("DELETE /gallery/:id", req.params.id);
    try {
        const photo = await Gallery.findById(req.params.id);

        if (!photo) {
            return res.status(404).json({message: 'Photo not found'});
        }

        if (photo.image) {
            const imagePath = path.resolve(__dirname, '..', photo.image);
            deleteFile(imagePath);
        }

        await Gallery.findByIdAndDelete(req.params.id);
        res.json({message: 'Photo deleted successfully'});
    } catch (error) {
        console.error('Error deleting photo:', error);
        res.status(500).json({
            message: 'Failed to delete photo', error: error.message
        });
    }
});

module.exports = router;