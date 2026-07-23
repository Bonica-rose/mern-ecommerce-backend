const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const authentication = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        console.log(token);
        
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

        const user = await User.findById(decoded.id).select({
            name: 1, email: 1, role: 1, passwordChangedAt: 1
        });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User no longer exists"
            });
        }

        // Check password change time
        if (
            user.passwordChangedAt &&
            decoded.iat * 1000 < user.passwordChangedAt.getTime()
        ) {
            return res.status(401).json({
                success: false,
                message: "Password changed. Please login again."
            });
        }

        req.user = user;
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