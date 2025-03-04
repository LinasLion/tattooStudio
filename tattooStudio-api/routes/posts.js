const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require('fs').promises;
const {authenticate} = require("./auth");
const Post = require("../models/post");

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads/posts');

        fs.mkdir(uploadDir, {recursive: true})
            .then(() => cb(null, uploadDir))
            .catch(err => cb(err, uploadDir));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        cb(null, `post-image-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload an image.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB file size limit
    }
});

router.get('/', async (req, res) => {
    console.log("GET /posts");
    try {
        const posts = await Post.find()
            .sort({createdAt: -1})
            .lean();

        const processedPosts = await Promise.all(posts.map(async (post) => {
            let imageBlob = null;

            if (post.image) {
                try {
                    const imagePath = path.join(__dirname, `..${post.image}`);

                    await fs.access(imagePath);

                    const imageBuffer = await fs.readFile(imagePath);
                    imageBlob = imageBuffer.toString('base64');
                } catch (imageError) {
                    console.error(`Error reading image for post ${post._id}:`, imageError);
                }
            }

            return {
                ...post,
                imageBlob,
            };
        }));

        res.json(processedPosts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({
            message: 'Error fetching posts',
            error: error.message
        });
    }
});

router.post('/', authenticate, upload.single('image'), async (req, res) => {
    console.log("POST /posts");
    try {
        const {title, content} = req.body;

        if (!title || !content) {
            if (req.file) {
                await fs.unlink(req.file.path).catch(() => {
                });
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
            await fs.unlink(req.file.path).catch(() => {
            });
        }

        res.status(500).json({
            message: "Error creating post",
            error: error.message
        });
    }
});


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
            await fs.unlink(imagePath).catch(() => {
            });
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