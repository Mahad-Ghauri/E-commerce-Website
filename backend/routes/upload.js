const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const upload = require('../middleware/upload');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Upload product image
// @route   POST /api/upload/product
// @access  Private/Admin
router.post(
    '/product',
    protect,
    authorize('admin'),
    upload.single('image'),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'Please upload an image',
                });
            }

            res.status(200).json({
                success: true,
                filename: req.file.filename,
                path: `/uploads/products/${req.file.filename}`,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
);

// @desc    Delete product image
// @route   DELETE /api/upload/product/:filename
// @access  Private/Admin
router.delete(
    '/product/:filename',
    protect,
    authorize('admin'),
    async (req, res) => {
        try {
            const filePath = path.join(
                __dirname,
                '..',
                process.env.UPLOAD_PATH || './uploads/products',
                req.params.filename
            );

            await fs.unlink(filePath);

            res.status(200).json({
                success: true,
                message: 'Image deleted successfully',
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
);

module.exports = router;
