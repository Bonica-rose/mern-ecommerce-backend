const mongoose = require("mongoose");
const Product = require("../models/product.model");
const uploadToCloudinary = require('../Utilities/imageUpload')

const getAllProducts = async (req, res) => {
    try {
        const {
            search, category, minPrice, maxPrice, rating, inStock, sort,
            page = 1, limit = 10,
        } = req.query;

        // Build Filter
        const filter = {};

        // Search (Text Index)
        if (search) {
            filter.$text = {
                $search: search,
            };
        }

        // Category
        if (category) {
            filter.category = {
                $in: category.split(","),
            };
        }

        // Price
        if (minPrice || maxPrice) {
            filter.price = {};

            if (minPrice) {
                filter.price.$gte = Number(minPrice);
            }

            if (maxPrice) {
                filter.price.$lte = Number(maxPrice);
            }
        }

        // Rating
        if (rating) {
            filter.ratings = {
                $gte: Number(rating),
            };
        }

        // In Stock
        if (inStock === "true") {
            filter.stock = {
                $gt: 0,
            };
        }

        // Sorting
        let sortOption = { createdAt: -1 };

        switch (sort) {
            case "price_asc":
                sortOption = { price: 1 };
                break;

            case "price_desc":
                sortOption = { price: -1 };
                break;

            case "rating":
                sortOption = { ratings: -1 };
                break;

            case "name":
                sortOption = { name: 1 };
                break;

            case "oldest":
                sortOption = { createdAt: 1 };
                break;

            case "newest":
            default:
                sortOption = { createdAt: -1 };
        }

        // Pagination
        const pageNumber = Number(page);
        const pageSize = Number(limit);
        const skip = (pageNumber - 1) * pageSize;

        // Execute Queries
        const [products, totalProducts] = await Promise.all([
            Product.find(filter)
                .sort(sortOption)
                .skip(skip)
                .limit(pageSize),
                // .lean(),

            Product.countDocuments(filter),
        ]);

        res.status(200).json({
            success: true,
            results: products.length,
            totalProducts,
            totalPages: Math.ceil(totalProducts / pageSize),
            currentPage: pageNumber,
            products,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getProductById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ success: false, message: "Invalid product id." });
        }
        const product = await Product.findById(req.params.id).lean();
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        return res.status(200).json({ success: true, product });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;

        const cloudinaryResponse = await uploadToCloudinary(req.file.path);

        const newProduct = await Product.create({
            name,
            description,
            price,
            category,
            stock,
            image: cloudinaryResponse
        });
        return res.status(201).json({ success: true, product: newProduct });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getProductCategories = async (req, res) => {
    try {
        const categories = await Product.distinct("category");

        res.status(200).json({
            success: true,
            results: categories.length,
            categories,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        let imageUrl;
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ success: false, message: "Invalid product id." });
        }

        if (req.file) {
            const cloudinaryRes = await uploadToCloudinary(req.file.path);
            imageUrl = cloudinaryRes
        }

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id,
            { name, description, price, category, stock, image: imageUrl },
            { new: true, runValidators: true }
        );
        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        return res.status(200).json({ success: true, product: updatedProduct });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ success: false, message: "Invalid product id." });
        }
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        return res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    getProductCategories,
    updateProduct,
    deleteProduct
};
