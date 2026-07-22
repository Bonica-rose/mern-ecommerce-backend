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

productRouter.route("/")
    .get(getAllProducts)
    .post(protect, restrictTo("Admin"), productValidator, validationCheck, upload.single('images'), createProduct);

productRouter.get("/categories", getProductCategories)    

productRouter.route("/:id")
    .get(getProductById)
    .put(protect, restrictTo("Admin"), productValidator, validationCheck, updateProduct)
    .delete(protect, restrictTo("Admin"), deleteProduct);

module.exports = productRouter;
