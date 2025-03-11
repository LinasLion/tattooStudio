const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    content: {
        type: String,
        required: [true, 'Please add some content'],
        maxlength: [5000, 'Content cannot be more than 5000 characters']
    },
    image: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updateAt: {
        type: Date,
        default: null
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

PostSchema.virtual('formattedCreatedAt').get(function() {
    return this.createdAt.toLocaleString();
});

PostSchema.index({ title: 'text', content: 'text' });

PostSchema.pre('save', function(next) {
    if (this.image) {
        const imageRegex = /\.(jpeg|jpg|png|gif)$/i;
        if (!imageRegex.test(this.image)) {
            throw new Error('Invalid image file type');
        }
    }
    next();
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;