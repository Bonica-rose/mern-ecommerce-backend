const mongoose = require("mongoose");

const orderValidator = (req, res, next) => {
    const errors = [];
    const { items, shippingAddress } = req.body;  

    // Validate the core items array presence
    if (!items || !Array.isArray(items) || items.length === 0) {
        errors.push({
            field: "items",
            message: "At least one order item is required."
        });
    } else {
        // Iterate over the nested items cleanly
        for (let i = 0; i < items.length; i++) {
            const item = items[i];

            // Validate Product ID existence and structural format safely
            if (!item.product || item.product.toString().trim() === "") {
                errors.push({
                    field: `items[${i}].product`,
                    message: `Product is required for item ${i + 1}.`
                });
                continue; // Prevents subsequent validation crash on undefined inputs
            }

            if (!mongoose.Types.ObjectId.isValid(item.product)) {
                errors.push({
                    field: `items[${i}].product`,
                    message: `Invalid product id for item ${i + 1}.`
                });
                continue; // Skip rest of checks for this broken product reference
            }

            // Validate Quantity values natively
            if (item.quantity === undefined || item.quantity === null || item.quantity === '') {
                errors.push({
                    field: `items[${i}].quantity`,
                    message: `Quantity is required for item ${i + 1}.`
                });
            } else if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
                errors.push({
                    field: `items[${i}].quantity`,
                    message: `Quantity must be a positive integer for item ${i + 1}.`
                });
            }

            // Secure the Pricing boundary rules
            if (item.price !== undefined) {
                errors.push({
                    field: `items[${i}].price`,
                    message: "Price should not be provided by the client."
                });
            }
        }
    }

    // Validate the Shipping Address metadata block
    if (!shippingAddress || typeof shippingAddress !== "string" || shippingAddress.trim() === "") {
        errors.push({
            field: "shippingAddress",
            message: "Shipping address is required."
        });
    }
    
    // Assign error payload context to the custom tracking array
    req.validationErrors = errors;
    return next();
};

module.exports = orderValidator;
