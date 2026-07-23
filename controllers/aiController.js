const {
    generateProductDescription,
} = require("../services/huggingface");

const generateDescription = async (req, res) => {
    try {
        const { name, category, price } = req.body;

        if (!name || !category) {
            return res.status(400).json({
                success: false,
                message: "Name and category are required.",
            });
        }

        const description = await generateProductDescription({
            name,
            category,
            price,
        });

        res.status(200).json({
            success: true,
            description,
        });
    } catch (error) {
        // res.status(500).json({
        //     success: false,
        //     message: "Failed to generate description.",
        // });

            console.error("AI ERROR:", error);

    res.status(500).json({
        success: false,
        message: error.message,
    });
    }
};

module.exports = {
    generateDescription,
};