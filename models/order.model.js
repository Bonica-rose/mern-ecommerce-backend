const mongoose = require("mongoose");
const User = require('./user.model')
const Product = require('./product.model')

const orderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true } // Captured at purchase time
});

const orderSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
        items: [orderItemSchema],
        totalAmount: { type: Number, required: true },
        shippingAddress: { type: String, required: true },
        orderStatus: { 
            type: String, 
            enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"], 
            default: "Pending" 
        },
        paymentMethod: { type: String, enum: ["COD", "Stripe"], default: "COD"},
        paymentStatus: { type: String, enum: ["Pending", "Paid", "Failed"], default: "Pending" },
        isDeleted: { type: Boolean, default: false },
        deletedAt: { type: Date, default: null}
    },
    { timestamps: true }
);

orderSchema.index({ isDeleted: 1, createdAt: -1 });

module.exports = mongoose.model("Order", orderSchema);