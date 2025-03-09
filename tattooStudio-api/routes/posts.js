const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require('fs').promises;
const {authenticate} = require("./auth");
const Post = require("../models/post");

const router = express.Router();

/**
 * Configure multer storage for post images
 * - Saves files to uploads/posts directory
 * - Creates directory if it doesn't exist
 * - Generates unique filenames with timestamps
 */
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads/posts');
        try {
            await fs.mkdir(uploadDir, {recursive: true});
            cb(null, uploadDir);
        } catch (err) {
            cb(err, uploadDir);
        }
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        cb(null, `post-image-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

/**
 * Filter function to only allow image files
 */
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload an image.'), false);
    }
};

/**
 * Configure multer with storage, file filter, and size limits
 */
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB file size limit
    }
});

/**
 * Helper function to process post images
 * Reads image file and converts to base64 string
 */
const processPostImage = async (post) => {
    if (!post) return null;

    let imageBlob = null;
    const processedPost = { ...post };

    if (processedPost.image) {
        try {
            const imagePath = path.join(__dirname, `..${processedPost.image}`);
            await fs.access(imagePath);
            const imageBuffer = await fs.readFile(imagePath);
            imageBlob = imageBuffer.toString('base64');
        } catch (imageError) {
            console.error(`Error reading image for post ${processedPost._id}:`, imageError);
        }
    }

    return {
        ...processedPost,
        imageBlob,
    };
};

/**
 * Helper function to clean up uploaded file on error
 */
const cleanupUploadedFile = async (filePath) => {
    if (filePath) {
        try {
            await fs.unlink(filePath);
        } catch (err) {
            console.error('Error cleaning up file:', err);
        }
    }
};

/**
 * GET /posts
 * Retrieves all posts sorted by creation date (newest first)
 * Includes base64-encoded images if available
 */
router.get('/', async (req, res) => {
    console.log("GET /posts");
    try {
        const posts = await Post.find()
            .sort({createdAt: -1})
            .lean();

        const processedPosts = await Promise.all(posts.map(processPostImage));
        res.json(processedPosts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({
            message: 'Error fetching posts',
            error: error.message
        });
    }
});

/**
 * POST /posts
 * Creates a new post with optional image upload
 * Requires authentication
 */
router.post('/', authenticate, upload.single('image'), async (req, res) => {
    console.log("POST /posts");
    try {
        const {title, content} = req.body;

        if (!title || !content) {
            if (req.file) {
                await cleanupUploadedFile(req.file.path);
            }
            return res.status(400).json({
                message: "Title and content are required"
            });
        }

        const postData = {
            title,
            content,
            image: req.file
                ? `/uploads/posts/${path.basename(req.file.path)}`
                : null,
            createdAt: new Date()
        };

        const post = await Post.create(postData);
        res.status(201).json(post);
    } catch (error) {
        console.error('Error creating post:', error);

        if (req.file) {
            await cleanupUploadedFile(req.file.path);
        }

        res.status(500).json({
            message: "Error creating post",
            error: error.message
        });
    }
});

/**
 * PATCH /posts/:id
 * Updates an existing post with optional image replacement
 * Requires authentication
 */
router.patch("/:id", authenticate, upload.single('image'), async (req, res) => {
    console.log("PATCH /posts/:id");
    try {
        const { title, content } = req.body;
        const postId = req.params.id;

        const existingPost = await Post.findById(postId);

        if (!existingPost) {
            if (req.file) {
                await cleanupUploadedFile(req.file.path);
            }
            return res.status(404).json({ message: 'Post not found' });
        }

        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (content !== undefined) updateData.content = content;

        updateData.updatedAt = new Date();

        if (req.file) {
            if (existingPost.image) {
                const oldImagePath = path.join(__dirname, `..${existingPost.image}`);
                await cleanupUploadedFile(oldImagePath);
            }

            updateData.image = `/uploads/posts/${path.basename(req.file.path)}`;
        }

        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            updateData,
            { new: true } // Return the updated document
        ).lean();

        const processedPost = await processPostImage(updatedPost);

        res.json(processedPost);
    } catch (error) {
        console.error('Error updating post:', error);

        if (req.file) {
            await cleanupUploadedFile(req.file.path);
        }

        res.status(500).json({
            message: "Error updating post",
            error: error.message
        });
    }
});

/**
 * DELETE /posts/:id
 * Deletes a post and its associated image
 * Requires authentication
 */
router.delete("/:id", authenticate, async (req, res) => {
    console.log("DELETE /posts/:id");
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            console.error("Post not found");
            return res.status(404).json({message: 'Post not found'});
        }

        if (post.image) {
            const imagePath = path.join(__dirname, `..${post.image}`);
            await cleanupUploadedFile(imagePath);
        }

        await Post.findByIdAndDelete(req.params.id);
        res.json({message: "Post deleted successfully"});
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({
            message: 'Error deleting post',
            error: error.message
        });
    }
});

module.exports = router;