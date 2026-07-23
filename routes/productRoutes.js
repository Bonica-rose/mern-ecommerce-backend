const express = require("express");
const productRouter = express.Router();

const upload = require('../middleware/multer');
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

productRouter.route("/").get(getAllProducts);
productRouter.route("/")
    .post(protect, restrictTo("Admin"), upload.single("image"), productValidator, validationCheck, createProduct);

productRouter.route("/categories").get(getProductCategories)    

productRouter.route("/:id")
    .get(getProductById)
    .put(protect, restrictTo("Admin"), upload.single('image'), productValidator, validationCheck, updateProduct)
    .delete(protect, restrictTo("Admin"), deleteProduct);

module.exports = productRouter;
