const Product = require("../models/product.model");
const User = require("../models/user.model");
const Order = require("../models/order.model");

const getDashboard = async (req, res) => {
    const [
        totalProducts,
        totalUsers,
        totalOrders,
        pendingOrders,
        deliveredOrders,
        paidOrders,
    ] = await Promise.all([
        Product.countDocuments(),
        User.countDocuments({ role: "User" }),
        Order.countDocuments(),
        Order.countDocuments({ orderStatus: "Pending" }),
        Order.countDocuments({ orderStatus: "Delivered" }),
        Order.countDocuments({ paymentStatus: "Paid" }),
    ]);

    res.json({
        success: true,
        data: {
            totalProducts,
            totalUsers,
            totalOrders,
            pendingOrders,
            deliveredOrders,
            paidOrders,
        },
    });
};

module.exports = { getDashboard };