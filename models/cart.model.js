const mongoose = require("mongoose");
const User = require('./user.model')
const Product = require('./product.model')

const cartItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
            default: 1,
        },
    },
    { _id: false }
);

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        guestId: {
            type: String
        },

        items: [cartItemSchema],
    },
    {
        timestamps: true,
    }
);

// A cart belongs either to a user or to a guest.
cartSchema.index({ user: 1 }, { unique: true, sparse: true });
cartSchema.index({ guestId: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model("Cart", cartSchema);