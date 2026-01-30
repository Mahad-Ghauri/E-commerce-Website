const express = require('express');
const {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
} = require('../controllers/wishlistController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/').get(protect, getWishlist).delete(protect, clearWishlist);

router
    .route('/:productId')
    .post(protect, addToWishlist)
    .delete(protect, removeFromWishlist);

module.exports = router;
