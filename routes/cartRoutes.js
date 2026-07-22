const express = require("express");
const cartRouter = express.Router();

const {
    getCart,
    addToCart,
    updateCartQty,
    removeCartItem,
    clearCart,
} = require("../controllers/cartController");

const protect = require("../middleware/authenticate");

cartRouter.get("/", protect, getCart);
cartRouter.post("/", protect, addToCart);
cartRouter.patch("/:productId", protect, updateCartQty);
cartRouter.delete("/:productId", protect, removeCartItem);
cartRouter.delete("/", protect, clearCart);

module.exports = cartRouter;