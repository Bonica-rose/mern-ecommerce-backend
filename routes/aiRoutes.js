const express = require("express");

const router = express.Router();

const protect = require("../middleware/authenticate");
const restrictTo = require("../middleware/authorize");

const {
    generateDescription,
} = require("../controllers/aiController");

router.post(
    "/generate-description",
    protect,
    restrictTo("Admin"),
    generateDescription
);

module.exports = router;