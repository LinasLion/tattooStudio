const mongoose = require('mongoose');

const GallerySchema = new mongoose.Schema({
    title: {
        type: String,
        default: null,
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    image: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

GallerySchema.virtual('formattedCreatedAt').get(function() {
    return this.createdAt.toLocaleString();
});

GallerySchema.index({ title: 'text' });

GallerySchema.pre('save', function(next) {
    if (this.image) {
        const imageRegex = /\.(jpeg|jpg|png|gif)$/i;
        if (!imageRegex.test(this.image)) {
            throw new Error('Invalid image file type');
        }
    }
    next();
});

const Gallery = mongoose.model('Gallery', GallerySchema);

module.exports = Gallery;