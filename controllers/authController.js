const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRY || "1d" }
    )
}

const registerUser = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            })
        }

        // Check if this is the very first user in the database
        const isFirstUser = (await User.countDocuments({})) === 0;

        // Set the role dynamically based on the count
        const role = isFirstUser ? "Admin" : "User";

        // Create new user
        const newUser = await User.create({
            name,
            email,
            password,
            role
        });

        res.status(201).json({
            success: true,
            message: 'Registered successfully'
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not exists'
            })
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // Generate JWT token
        const token = generateToken(user);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // true in production with HTTPS
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000 // 1 day = 86,400,000 ms
        });

        res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }           
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const logoutUser = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    });

    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
};

const getMe = async (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user
    });
};

module.exports = { registerUser, loginUser, logoutUser, getMe }