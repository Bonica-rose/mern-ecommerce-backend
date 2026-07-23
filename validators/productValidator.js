const productValidator = (req, res, next) => {

    // console.log("BODY:", req.body);
    
    const errors = [];
    const {
        name,
        description,
        category
    } = req.body;

    const price = Number(req.body.price);
    const stock = Number(req.body.stock);
    const ratings = Number(req.body.ratings);

    // Name 
    if (!name || typeof name !== "string" || name.trim() === "") {
        errors.push({ field: "name", message: "Product name is required" });
    } else if (name.trim().length < 3 || name.trim().length > 50) {
        errors.push({ field: "name", message: "Name must be between 3 and 50 characters" });
    }

    // Description
    if (!description || typeof description !== "string" || description.trim() === "") {
        errors.push({ field: "description", message: "Product description is required" });
    } else if (description.trim().length < 10) {
        errors.push({ field: "description", message: "Description must be at least 10 characters long" });
    }

    // Category
    if (!category || typeof category !== "string" || category.trim() === "") {
        errors.push({ field: "category", message: "Category is required" });
    }

    // Price
    if (Number.isNaN(price) || price < 0) {
        errors.push({
            field: "price",
            message: "Price must be a valid positive number",
        });
    }

    // Stock
    if (!Number.isInteger(stock) || stock < 0) {
        errors.push({
            field: "stock",
            message: "Stock must be a positive whole integer",
        });
    }

    // Ratings (optional)
    if (
        req.body.ratings !== undefined &&
        (Number.isNaN(ratings) || ratings < 0 || ratings > 5)
    ) {
        errors.push({
            field: "ratings",
            message: "Ratings must be between 0 and 5",
        });
    }

    // console.log(req.file);    

    if (req.method == 'POST' && !req.file) {
        errors.push({ field: "image", message: "Image is required" });
    }

    req.validationErrors = errors;
    next();
};

module.exports = productValidator;