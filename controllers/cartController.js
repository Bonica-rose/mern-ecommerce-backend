const mongoose = require("mongoose");

const Cart = require("../models/cart.model");
const Product = require("../models/product.model");

// Helper
const buildCartResponse = (cart) => {
    const totalQty = cart.items.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    const totalAmount = cart.items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    return {
        success: true,
        items: cart.items,
        totalQty,
        totalAmount,
    };
};

/* GET /api/cart */
const getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({
            user: req.user._id,
        }).populate(
            "items.product",
            "name price image stock category"
        );

        if (!cart) {
            return res.status(200).json({
                success: true,
                items: [],
                totalQty: 0,
                totalAmount: 0,
            });
        }

        return res.status(200).json(buildCartResponse(cart));
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/* POST /api/cart */
const addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product id.",
            });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found.",
            });
        }

        if (product.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: "Insufficient stock.",
            });
        }

        let cart = await Cart.findOne({
            user: req.user._id,
        });

        if (!cart) {
            cart = await Cart.create({
                user: req.user._id,
                items: [],
            });
        }

        const existingItem = cart.items.find(
            (item) =>
                item.product.toString() === productId
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({
                product: productId,
                quantity,
            });
        }

        await cart.save();

        cart = await Cart.findById(cart._id).populate(
            "items.product",
            "name price image stock category"
        );

        return res.status(200).json(buildCartResponse(cart));
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/* PATCH /api/cart/:productId */
const updateCartQty = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product id.",
            });
        }

        if (quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be at least 1.",
            });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found.",
            });
        }

        if (quantity > product.stock) {
            return res.status(400).json({
                success: false,
                message: "Insufficient stock.",
            });
        }

        const cart = await Cart.findOne({
            user: req.user._id,
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found.",
            });
        }

        const item = cart.items.find(
            (item) =>
                item.product.toString() === productId
        );

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found in cart.",
            });
        }

        item.quantity = quantity;

        await cart.save();

        const updatedCart = await Cart.findById(cart._id).populate(
            "items.product",
            "name price image stock category"
        );

        return res.status(200).json(buildCartResponse(updatedCart));
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/* DELETE /api/cart/:productId */
const removeCartItem = async (req, res) => {
    try {
        const { productId } = req.params;

        const cart = await Cart.findOne({
            user: req.user._id,
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found.",
            });
        }

        cart.items = cart.items.filter(
            (item) =>
                item.product.toString() !== productId
        );

        await cart.save();

        const updatedCart = await Cart.findById(cart._id).populate(
            "items.product",
            "name price image stock category"
        );

        return res.status(200).json(buildCartResponse(updatedCart));
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/* DELETE /api/cart */
const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({
            user: req.user._id,
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found.",
            });
        }

        cart.items = [];

        await cart.save();

        return res.status(200).json({
            success: true,
            message: "Cart cleared successfully.",
            items: [],
            totalQty: 0,
            totalAmount: 0,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    getCart,
    addToCart,
    updateCartQty,
    removeCartItem,
    clearCart,
};