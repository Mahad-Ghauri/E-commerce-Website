const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a product name'],
            trim: true,
            maxlength: [100, 'Name cannot be more than 100 characters'],
        },
        category: {
            type: String,
            required: [true, 'Please add a category'],
            enum: ['jordan 1', 'air force 1', 'air max 95', 'air max 270'],
        },
        description: {
            type: String,
            required: [true, 'Please add a description'],
            maxlength: [500, 'Description cannot be more than 500 characters'],
        },
        price: {
            type: Number,
            required: [true, 'Please add a price'],
            min: [0, 'Price cannot be negative'],
        },
        sizes: {
            type: [Number],
            required: [true, 'Please add available sizes'],
            validate: {
                validator: function (v) {
                    return v && v.length > 0;
                },
                message: 'At least one size must be available',
            },
        },
        images: {
            type: [String],
            required: [true, 'Please add at least one image'],
            validate: {
                validator: function (v) {
                    return v && v.length > 0;
                },
                message: 'At least one image is required',
            },
        },
        stock: {
            type: Number,
            required: [true, 'Please add stock quantity'],
            min: [0, 'Stock cannot be negative'],
            default: 0,
        },
        featured: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Index for search functionality
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
