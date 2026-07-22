const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const optionalAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        // No token? Continue as guest.
        if (!token) {
            return next();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select({
            name: 1,
            email: 1,
            role: 1,
            passwordChangedAt: 1,
        });

        if (!user) {
            return next();
        }

        if (
            user.passwordChangedAt &&
            decoded.iat * 1000 < user.passwordChangedAt.getTime()
        ) {
            return next();
        }

        req.user = user;
        req.token = token;
        req.tokenExpiry = decoded.exp;

        next();
    } catch (err) {
        // Ignore invalid/expired token and continue as guest
        next();
    }
};

module.exports = optionalAuth;