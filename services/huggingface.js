const { InferenceClient } = require("@huggingface/inference");

const client = new InferenceClient(process.env.HUGGINGFACE_API_KEY);

const generateProductDescription = async ({ name, category, price }) => {
    const prompt = `
Write a professional ecommerce product description.

Product Name: ${name}
Category: ${category}
Price: ₹${price}

Maximum 25 words.
`;

    const result = await client.chatCompletion({
        model: "Qwen/Qwen2.5-7B-Instruct",
        messages: [
            {
                role: "user",
                content: prompt,
            },
        ],
        max_tokens: 150,
    });

    return result.choices[0].message.content;
};

module.exports = {
    generateProductDescription,
};