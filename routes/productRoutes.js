const express = require("express");
const router = express.Router();

const validationCheck = require('../middleware/validation');
const protect = require('../middleware/authenticate');
const restrictTo = require('../middleware/authorize');

const productValidator = require("../validators/productValidator");

const {
    getAllProducts,
    getProductById,
    createProduct,
    getProductCategories,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

router.route("/")
    .get(getAllProducts)
    .post(protect, restrictTo("Admin"), productValidator, validationCheck, createProduct);

router.get("/categories", getProductCategories)    

router.route("/:id")
    .get(getProductById)
    .put(protect, restrictTo("Admin"), productValidator, validationCheck, updateProduct)
    .delete(protect, restrictTo("Admin"), deleteProduct);

module.exports = router;
