const mongoose = require("mongoose");
const User = require('../models/user.model');
const Order = require('../models/order.model');
const Product = require('../models/product.model'); 

// Global tracking constants matching schema enum values exactly
const allowedOrderStatus = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
const allowedPaymentStatus = ["Pending", "Paid", "Failed"];

/* Get all users sorted by registration date */
const getAllUsersAdmin = async (req, res) => {
    try {
        const users = await User.aggregate([
            { $sort: { createdAt: -1 } },
            {
                $project: {
                    password: 0,
                    __v: 0
                }
            }
        ]);

        return res.status(200).json({
            success: true,
            message: 'Users found',
            results: users.length,
            data: users,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

/* Delete a specific user account by ID */
const deleteUserAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user id."
            });
        }

        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User account not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: 'User deleted'
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

/* Get all orders with unnested populated user profiles */
const getAllOrdersAdmin = async (req, res) => {
    try {
        const orders = await Order.aggregate([
            { $match: { isDeleted: false } },
            { $sort: { createdAt: -1 } }, 
            {
                $lookup: {
                    from: "users", 
                    localField: "user",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: 1,
                    items: 1,
                    totalAmount: 1,
                    orderStatus: 1,
                    paymentStatus: 1,
                    shippingAddress: 1,
                    createdAt: 1,
                    // Conditional checks prevent crashes if a user was deleted
                    user: {
                        $cond: {
                            if: { $ifNull: ["$user", false] },
                            then: {
                                _id: "$user._id",
                                name: "$user.name",
                                email: "$user.email"
                            },
                            else: { message: "Account deleted" }
                        }
                    }
                }
            }
        ]); 

        return res.status(200).json({
            success: true,
            results: orders.length,
            orders
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

/* Modify order status or payment status with automated inventory restock checks */
const updateOrderStatusAdmin = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { status, paymentStatus } = req.body;

        if (status === undefined && paymentStatus === undefined) {
            return res.status(400).json({
                success: false,
                message: "Please provide either an order status or payment status to update"
            });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        if (status !== undefined) {
            if (!allowedOrderStatus.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid order status. Allowed: ${allowedOrderStatus.join(", ")}`
                });
            }

            // If order transitions to Cancelled, restock product inventory automatically
            if (status === "Cancelled" && order.orderStatus !== "Cancelled") {
                for (const item of order.items) {
                    await Product.findByIdAndUpdate(item.product, {
                        $inc: { stock: item.quantity }
                    });
                }
            }

            order.orderStatus = status;
        }

        if (paymentStatus !== undefined) {
            if (!allowedPaymentStatus.includes(paymentStatus)) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid payment status. Allowed: ${allowedPaymentStatus.join(", ")}`
                });
            }

            order.paymentStatus = paymentStatus;
        }

        await order.save();

        return res.status(200).json({
            success: true,
            message: 'Order status modified successfully',
            order: {
                _id: order._id,
                orderStatus: order.orderStatus,
                paymentStatus: order.paymentStatus,
                totalAmount: order.totalAmount
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getAllUsersAdmin,
    deleteUserAdmin,
    getAllOrdersAdmin,
    updateOrderStatusAdmin
};
