const express = require('express');
const {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
} = require('../controllers/cartController');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// All cart routes support both authenticated and guest users
router.get('/', optionalAuth, getCart);
router.post('/add', optionalAuth, addToCart);
router.put('/update/:itemId', optionalAuth, updateCartItem);
router.delete('/remove/:itemId', optionalAuth, removeFromCart);
router.delete('/clear', optionalAuth, clearCart);

module.exports = router;
