const express = require("express");
const router = express.Router();

const {
    registerUser,
    loginUser,
    logoutUser,
    getMe
} = require("../controllers/authController");

const protect = require("../middleware/authenticate");
const restrictTo = require('../middleware/authorize')
const registerValidator = require("../validators/registerValidator");
const loginValidator = require("../validators/loginValidator");
const validationCheck = require('../middleware/validation')

router.post("/register", registerValidator, validationCheck, registerUser);
router.post("/login", loginValidator, validationCheck, loginUser);
router.post("/logout", logoutUser);
router.get("/me", protect, getMe);

module.exports = router;