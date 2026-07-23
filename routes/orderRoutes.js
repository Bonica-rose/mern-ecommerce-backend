const express = require("express");
const router = express.Router();

const validationCheck = require('../middleware/validation');
const protect = require('../middleware/authenticate');
const restrictTo = require('../middleware/authorize');

const orderValidator = require("../validators/orderValidator");

const {
    placeOrder,
    getMyOrders,
    getOrderById,
    cancelOrder
} = require("../controllers/orderController");

router.use(protect); // Secure all order routes

router.route("/").post(orderValidator, validationCheck, placeOrder)
router.route("/my-orders").get(getMyOrders);    

router.route("/cancel/:id").put(cancelOrder);
router.get("/:id", restrictTo('User'), getOrderById);



module.exports = router;
