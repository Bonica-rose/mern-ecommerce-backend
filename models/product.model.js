const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true, index: true },
        description: { type: String, required: true },
        price: { type: Number, required: true, min: 0, index: true },
        category: { type: String, required: true, trim: true, index: true },
        stock: { type: Number, required: true, min: 0, default: 0, index:true },
        ratings: { type: Number, min: 0, max: 5, default: 0, index:true },
        image: { type: String, required: true}
    },
    { timestamps: true }
);

// Compound Text Index for optimal text searching
productSchema.index({ name: "text", description: "text" });

module.exports = mongoose.model("Product", productSchema);
