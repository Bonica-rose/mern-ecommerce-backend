const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: 3,
            maxlength: 30
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please enter a valid email"]
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 6,
            select: false // Hide password by default
        },
        role: {
            type: String,
            enum: ["Admin", "User", "Guest"],
            default: "User"
        },
        mobile: {
            type: String,
            trim: true
        },
        address: {
            type: String,
            trim: true,
            default: ""
        },
        passwordChangedAt: { type: Date }
    },
    {
        timestamps: true
    }
)
userSchema.index({ role: 1 });

// Hash password before saving
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password during login
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema)