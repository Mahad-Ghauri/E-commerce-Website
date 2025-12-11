const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Get cart identifier (user ID or session ID)
const getCartIdentifier = (req) => {
    if (req.user) {
        return { user: req.user.id };
    } else {
        return { sessionId: req.sessionID };
    }
};

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Public (with optional auth)
exports.getCart = async (req, res, next) => {
    try {
        const identifier = getCartIdentifier(req);
        let cart = await Cart.findOne(identifier).populate('items.product');

        if (!cart) {
            cart = await Cart.create({ ...identifier, items: [] });
        }

        res.status(200).json({
            success: true,
            data: cart,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Public (with optional auth)
exports.addToCart = async (req, res, next) => {
    try {
        const { productId, quantity, size } = req.body;

        // Validate product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        // Check if size is available
        if (!product.sizes.includes(size)) {
            return res.status(400).json({
                success: false,
                message: 'Selected size not available',
            });
        }

        // Check stock
        if (product.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient stock',
            });
        }

        const identifier = getCartIdentifier(req);
        let cart = await Cart.findOne(identifier);

        if (!cart) {
            cart = await Cart.create({ ...identifier, items: [] });
        }

        // Check if item already in cart
        const existingItemIndex = cart.items.findIndex(
            (item) =>
                item.product.toString() === productId && item.size === size
        );

        if (existingItemIndex > -1) {
            // Update quantity
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            // Add new item
            cart.items.push({
                product: productId,
                quantity,
                size,
                price: product.price,
            });
        }

        await cart.save();
        await cart.populate('items.product');

        res.status(200).json({
            success: true,
            data: cart,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/update/:itemId
// @access  Public (with optional auth)
exports.updateCartItem = async (req, res, next) => {
    try {
        const { quantity } = req.body;
        const identifier = getCartIdentifier(req);

        const cart = await Cart.findOne(identifier);

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found',
            });
        }

        const item = cart.items.id(req.params.itemId);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item not found in cart',
            });
        }

        // Validate stock
        const product = await Product.findById(item.product);
        if (product.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient stock',
            });
        }

        item.quantity = quantity;
        await cart.save();
        await cart.populate('items.product');

        res.status(200).json({
            success: true,
            data: cart,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:itemId
// @access  Public (with optional auth)
exports.removeFromCart = async (req, res, next) => {
    try {
        const identifier = getCartIdentifier(req);
        const cart = await Cart.findOne(identifier);

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found',
            });
        }

        cart.items.pull(req.params.itemId);
        await cart.save();
        await cart.populate('items.product');

        res.status(200).json({
            success: true,
            data: cart,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Clear cart
// @route   DELETE /api/cart/clear
// @access  Public (with optional auth)
exports.clearCart = async (req, res, next) => {
    try {
        const identifier = getCartIdentifier(req);
        const cart = await Cart.findOne(identifier);

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found',
            });
        }

        cart.items = [];
        await cart.save();

        res.status(200).json({
            success: true,
            data: cart,
        });
    } catch (error) {
        next(error);
    }
};
