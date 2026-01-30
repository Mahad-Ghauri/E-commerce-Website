const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        rating: {
            type: Number,
            required: [true, 'Please add a rating'],
            min: [1, 'Rating must be at least 1'],
            max: [5, 'Rating cannot be more than 5'],
        },
        title: {
            type: String,
            required: [true, 'Please add a review title'],
            maxlength: [100, 'Title cannot be more than 100 characters'],
        },
        comment: {
            type: String,
            required: [true, 'Please add a review comment'],
            maxlength: [500, 'Comment cannot be more than 500 characters'],
        },
        verified: {
            type: Boolean,
            default: false, // Set to true if user purchased the product
        },
    },
    {
        timestamps: true,
    }
);

// Prevent user from submitting more than one review per product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Static method to get average rating and count
reviewSchema.statics.getAverageRating = async function (productId) {
    const obj = await this.aggregate([
        {
            $match: { product: productId },
        },
        {
            $group: {
                _id: '$product',
                averageRating: { $avg: '$rating' },
                reviewCount: { $sum: 1 },
            },
        },
    ]);

    try {
        await this.model('Product').findByIdAndUpdate(productId, {
            averageRating: obj[0]?.averageRating || 0,
            reviewCount: obj[0]?.reviewCount || 0,
        });
    } catch (err) {
        console.error(err);
    }
};

// Call getAverageRating after save
reviewSchema.post('save', function () {
    this.constructor.getAverageRating(this.product);
});

// Call getAverageRating before remove
reviewSchema.pre('remove', function () {
    this.constructor.getAverageRating(this.product);
});

module.exports = mongoose.model('Review', reviewSchema);
