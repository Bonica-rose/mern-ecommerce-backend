const jwt = require("jsonwebtoken");
const User = require('../models/user.model')
const bcrypt = require('bcryptjs')

const getUserProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        // console.log("Requesting user ID:", req.user._id); // Debugging line
        // console.log("User ID from token:", userId); // Debugging line

        const user = await User.findById(userId).select(' -__v'); // Exclude  __v field
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            message: "User profile retrieved successfully",
            user
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { name, email, mobile, address } = req.body;

        const user = await User.findById(userId).select('-__v'); // Exclude  __v field
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Update user profile
        user.name = name || user.name;
        user.email = email || user.email;
        user.mobile = mobile || user.mobile;
        user.address = address || user.address;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateUserPassword = async (req, res) => {
    try {
        const userId = req.user._id;
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(userId).select("+password +passwordChangedAt");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Check if current password matches
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            })
        }

        // Check if new password is not the same as the current password
        const isNewPasswordSameAsCurrent = await bcrypt.compare(newPassword, user.password);
        if (isNewPasswordSameAsCurrent) {
            return res.status(400).json({
                success: false,
                message: 'New password cannot be the same as the current password'
            })
        }

        // Update password
        user.password = newPassword;
        user.passwordChangedAt = new Date();
        await user.save();

        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax"
        });

        res.status(200).json({
            success: true,
            message: "Password changed successfully. Please login again."
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getUserProfile, updateUserProfile, updateUserPassword
};