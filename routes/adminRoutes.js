const express = require("express");
const router = express.Router();

const protect = require("../middleware/authenticate");
const restrictTo = require("../middleware/authorize");
const validationCheck = require("../middleware/validation");

const orderStatusValidator = require("../validators/orderStatusValidator");

const {
    getAllUsersAdmin,
    deleteUserAdmin,
    getAllOrdersAdmin,
    getOrderByIdAdmin,
    updateOrderStatusAdmin
} = require("../controllers/adminController");

const { getDashboard } = require('../controllers/dashboardController')

router.use(protect);
router.use(restrictTo("Admin"));

// - Dashboard Endpoints ---
router.route("/dashboard").get(getDashboard);

// --- User Management Endpoints ---
router.route("/users").get(getAllUsersAdmin);
router.route("/users/:id").delete(deleteUserAdmin);

// --- Order  Management Endpoints ---
router.route("/orders").get(getAllOrdersAdmin);
router.route("/orders/:id").get(getOrderByIdAdmin);
router.route("/orders/:id")
    .put(orderStatusValidator, validationCheck, updateOrderStatusAdmin);

module.exports = router;
