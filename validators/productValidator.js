const productValidator = (req, res, next) => {
    
    const errors = [];
    const { name, description, price, category, stock } = req.body;

    // Name 
    if (!name || typeof name !== "string" || name.trim() === "") {
        errors.push({ field: "name", message: "Product name is required" });
    } else if (name.trim().length < 3 || name.trim().length > 25) {
        errors.push({ field: "name", message: "Name must be between 3 and 25 characters" });
    }

    // Description
    if (!description || typeof description !== "string" || description.trim() === "") {
        errors.push({ field: "description", message: "Product description is required" });
    } else if (description.trim().length < 10) {
        errors.push({ field: "description", message: "Description must be at least 10 characters long" });
    }

    // Price 
    if (price === undefined || price === null || typeof price !== "number" || price < 0) {
        errors.push({ field: "price", message: "Price must be a valid positive number" });
    }

    // Category
    if (!category || typeof category !== "string" || category.trim() === "") {
        errors.push({ field: "category", message: "Category is required" });
    }

    // Stock 
    if (stock === undefined || stock === null || !Number.isInteger(stock) || stock < 0) {
        errors.push({ field: "stock", message: "Stock must be a positive whole integer" });
    }

    if (!req.file) {
        errors.push({ field: "image", message: "Image is required" });
    }

    req.validationErrors = errors;
    next();
};

module.exports = productValidator;