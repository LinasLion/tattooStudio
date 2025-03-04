const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const {authenticate} = require("./auth"); // Make sure this path is correct
const Gallery = require('../models/gallery');

// Define storage for uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Create uploads directory if it doesn't exist
        const uploadDir = path.join(__dirname, '..', 'uploads', 'gallery');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, {recursive: true});
        }
        cb(null, uploadDir);
    }, filename: function (req, file, cb) {
        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Set up multer with the storage configuration
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

// GET all gallery photos
router.get('/', async (req, res) => {
    try {
        const photos = await Gallery.find().sort({createdAt: -1});

        // Process each photo to add the image data
        const photosWithImages = await Promise.all(photos.map(async (photo) => {
            const photoObj = photo.toObject();

            // Check if photo has an image path
            if (photo.image) {
                try {
                    // Get full path to the image file
                    const imagePath = path.resolve(__dirname, '..', photo.image);
                    console.log('Reading image from:', imagePath);

                    // Check if the file exists before reading
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
        }));

        res.json(photosWithImages);
    } catch (error) {
        console.error('Error fetching photos:', error);
        res.status(500).json({message: 'Failed to fetch photos', error: error.message});
    }
});

// POST a new photo
router.post('/', authenticate, upload.single('image'), async (req, res) => {
    try {
        // Check if a file was uploaded
        if (!req.file) {
            return res.status(400).json({message: 'Image file is required'});
        }

        console.log('Uploaded file:', req.file);

        // Make the file path relative to project root
        const relativePath = req.file.path.replace(path.resolve(__dirname, '..') + '/', '');

        // Create a new photo document
        const newPhoto = new Gallery({
            title: req.body.title || '', image: relativePath,  // Save the relative path
        });

        console.log('Creating new photo:', newPhoto);

        // Save the photo to the database
        const savedPhoto = await newPhoto.save();
        console.log('Saved photo:', savedPhoto);

        // Prepare response with image data
        const photoObj = savedPhoto.toObject();
        if (savedPhoto.image) {
            try {
                const imagePath = path.resolve(__dirname, '..', savedPhoto.image);
                if (fs.existsSync(imagePath)) {
                    const imageData = fs.readFileSync(imagePath);
                    photoObj.imageBlob = imageData.toString('base64');
                }
            } catch (error) {
                console.error(`Error reading uploaded image: ${savedPhoto.image}`, error);
                photoObj.imageBlob = null;
            }
        }

        res.status(201).json(photoObj);
    } catch (error) {
        console.error('Error creating photo:', error);
        res.status(500).json({message: 'Failed to create photo', error: error.message});
    }
});

// DELETE a photo
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const photo = await Gallery.findById(req.params.id);

        if (!photo) {
            return res.status(404).json({message: 'Photo not found'});
        }

        // Delete the image file if it exists
        if (photo.image) {
            try {
                const imagePath = path.resolve(__dirname, '..', photo.image);
                console.log('Deleting file:', imagePath);

                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                    console.log('File deleted successfully');
                } else {
                    console.log('File not found, skipping delete');
                }
            } catch (error) {
                console.error(`Error deleting image file: ${photo.image}`, error);
                // Continue with deletion from database even if file deletion fails
            }
        }

        // Remove the photo from the database
        await Gallery.findByIdAndDelete(req.params.id);
        res.json({message: 'Photo deleted successfully'});
    } catch (error) {
        console.error('Error deleting photo:', error);
        res.status(500).json({message: 'Failed to delete photo', error: error.message});
    }
});

module.exports = router;