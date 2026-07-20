const mongoose = require("mongoose");

const orderStatusValidator = (req, res, next) => {
    const errors = [];
    const { status, paymentStatus } = req.body;
    const { id } = req.params;

    // Verify the URL ID Parameter Format
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        errors.push({ 
            field: "id", 
            message: "Invalid or malformed Order ID parameter format" 
        });
    }

    // Validate Order Status - Only if explicitly sent
    if (status !== undefined) {
        const allowedOrderStatus = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
        
        if (typeof status !== "string" || status.trim() === "") {
            errors.push({ 
                field: "status", 
                message: "Order status value cannot be empty text" 
            });
        } else if (!allowedOrderStatus.includes(status)) {
            errors.push({ 
                field: "status", 
                message: `Invalid order status. Must be one of: ${allowedOrderStatus.join(", ")}` 
            });
        }
    }

    // Validate Payment Status - Only if explicitly sent
    if (paymentStatus !== undefined) {
        const allowedPaymentStatus = ["Pending", "Paid", "Failed"];
        
        if (typeof paymentStatus !== "string" || paymentStatus.trim() === "") {
            errors.push({ 
                field: "paymentStatus", 
                message: "Payment status value cannot be empty text" 
            });
        } else if (!allowedPaymentStatus.includes(paymentStatus)) {
            errors.push({ 
                field: "paymentStatus", 
                message: `Invalid payment status. Must be one of: ${allowedPaymentStatus.join(", ")}` 
            });
        }
    }

    req.validationErrors = errors;
    return next();
};

module.exports = orderStatusValidator;
