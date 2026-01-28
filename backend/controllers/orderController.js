const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
    try {
        const { shippingAddress, paymentMethod } = req.body;

        if (!shippingAddress) {
            return res.status(400).json({
                success: false,
                message: 'Shipping address is required',
            });
        }

        const requiredFields = ['street', 'city', 'state', 'zipCode', 'country'];
        const missingFields = requiredFields.filter(
            (field) => !shippingAddress[field]
        );

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing shipping fields: ${missingFields.join(', ')}`,
            });
        }

        if (!paymentMethod) {
            return res.status(400).json({
                success: false,
                message: 'Payment method is required',
            });
        }

        // Get user's cart
        const cart = await Cart.findOne({ user: req.user.id }).populate(
            'items.product'
        );

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Cart is empty',
            });
        }

        // Validate stock for all items
        for (const item of cart.items) {
            const product = await Product.findById(item.product._id);
            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.name}`,
                });
            }
        }

        // Create order items
        const orderItems = cart.items.map((item) => ({
            product: item.product._id,
            name: item.product.name,
            quantity: item.quantity,
            size: item.size,
            price: item.price,
            image: item.product.images[0],
        }));

        // Create order
        const order = await Order.create({
            user: req.user.id,
            items: orderItems,
            shippingAddress,
            paymentMethod,
            totalAmount: cart.totalPrice,
        });

        // Update product stock
        for (const item of cart.items) {
            await Product.findByIdAndUpdate(item.product._id, {
                $inc: { stock: -item.quantity },
            });
        }

        // Clear cart
        cart.items = [];
        await cart.save();

        res.status(201).json({
            success: true,
            data: order,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user's orders
// @route   GET /api/orders
// @access  Private
exports.getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort({
            createdAt: -1,
        });

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        // Make sure user owns order or is admin
        if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this order',
            });
        }

        res.status(200).json({
            success: true,
            data: order,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res, next) => {
    try {
        const { orderStatus, paymentStatus } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        if (orderStatus) {
            order.orderStatus = orderStatus;
            if (orderStatus === 'delivered') {
                order.deliveredAt = Date.now();
            }
        }

        if (paymentStatus) {
            order.paymentStatus = paymentStatus;
            if (paymentStatus === 'completed') {
                order.paidAt = Date.now();
            }
        }

        await order.save();

        res.status(200).json({
            success: true,
            data: order,
        });
    } catch (error) {
        next(error);
    }
};
