const express = require("express");
const cartRouter = express.Router();

const {
    getCart,
    addToCart,
    updateCartQty,
    removeCartItem,
    clearCart,
} = require("../controllers/cartController");

const optionalAuth = require("../middleware/optionalAuth");
const guestCheck = require("../middleware/guestSession");

cartRouter.use(optionalAuth);
cartRouter.use(guestCheck);

cartRouter.get("/", getCart);
cartRouter.post("/", addToCart);
cartRouter.patch("/:productId", updateCartQty);
cartRouter.delete("/:productId", removeCartItem);
cartRouter.delete("/", clearCart);

module.exports = cartRouter;