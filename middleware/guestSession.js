const { v4: uuidv4 } = require("uuid");

const guestSession = (req, res, next) => {
    
    // Logged-in users don't need a guestId
    if (req.user) {
        return next();
    }

    let guestId = req.cookies.guestId;

    // If no guest cookie exists, create one
    if (!guestId) {
        guestId = uuidv4();

        res.cookie("guestId", guestId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });

        console.log("New Guest:", guestId);
    }

    req.guestId = guestId;

    next();
};

module.exports = guestSession;