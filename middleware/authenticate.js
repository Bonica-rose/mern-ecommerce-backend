const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const authentication = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authenticated"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = await User.findById(decoded.id).select({
            name: 1, email: 1, role: 1
        });

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "User no longer exists"
            });
        }
        req.token = token;
        req.tokenExpiry = decoded.exp;
        return next();        

    } catch (error) {
        let message = "Invalid token";
        if (error.name === "TokenExpiredError") {
            message = "Token has expired";
        }
        return res.status(401).json({ success: false, message });
    }
};

module.exports = authentication;