const Order = require('../models/order.model')
const Product = require('../models/product.model')

const getMyOrders = async (req, res) => {
    try {
        const userId = req.user._id;
        const orders = await Order.find({ user: userId, isDeleted: false })
            .populate("items.product", "name images")
            .sort({ createdAt: -1 }) // Latest orders first
            .lean();

        res.status(200).json({
            success: true,
            message: 'Orders found',
            count: orders.length,
            myOrders: orders,
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const placeOrder = async (req, res) => {
    try {
        const userId = req.user._id;
        const { items, shippingAddress } = req.body;

        let orderedItems = [];
        let calculatedTotal = 0;

        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product ${item.product} not found` 
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for product: ${product.name}. Available: ${product.stock}`
                });
            }

            const subtotal = product.price * item.quantity;
            calculatedTotal += subtotal;

            orderedItems.push({
                product: product._id,
                quantity: item.quantity,
                price: product.price
            });

            // Adjust inventory levels directly
            product.stock -= item.quantity;
            await product.save();

        }

        const newOrder = new Order({
            user: userId,
            items: orderedItems,
            totalAmount: calculatedTotal,
            shippingAddress
        });

        const savedOrder = await newOrder.save();

        res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            order: savedOrder,
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getOrderById = async (req, res) => {
    try {
        const orderId = req.params.id;
        const userId = req.user._id;  
        const userRole = req.user.role;

        const order = await Order.findOne({ _id: orderId, isDeleted: false })
            .populate('items.product', "name images");
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Block if it's NOT the owner AND NOT an Admin
        if (order.user.toString() !== userId.toString() && userRole !== "Admin") {
            return res.status(403).json({
                success: false,
                message: "Unauthorized access to this order record"
            });
        }

        res.status(200).json({
            success: true,
            message: 'Order found',
            data: order,
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const cancelOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const userId = req.user._id;

        const order = await Order.findOne({ _id: orderId, user: userId, isDeleted: false });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        if (order.orderStatus !== 'Pending') {
            return res.status(400).json({
                success: false,
                message: 'Only pending orders can be cancelled'
            });
        }        

        // Restocking items into products
        for (const item of order.items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: item.quantity } // Automatically adds the stock counts back securely
            });
        }

        order.orderStatus = 'Cancelled';
        await order.save();

        res.status(200).json({
            success: true,
            message: 'Order cancelled successfully',
            data: order,
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    getMyOrders,
    placeOrder,
    getOrderById,
    cancelOrder
}