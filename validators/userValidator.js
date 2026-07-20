const profileValidator = (req, res, next) => {

    const errors = [];
    const { name, email, mobile, address } = req.body;

    // Name (Required)
    if (!name || name.trim() === "") {
        errors.push({
            field: "name",
            message: "Name cannot be empty."
        });
    } else if (name.trim().length < 3 || name.trim().length > 30) {
        errors.push({
            field: "name",
            message: "Name must be between 3 and 30 characters"
        });
    }

    // Email (Optional)
    if (email !== undefined) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email.trim())) {
            errors.push({
                field: "email",
                message: "Invalid email address."
            });
        }
    }

    // Mobile (Optional)
    if (mobile !== undefined && mobile !== "") {
        const mobileRegex = /^[6-9]\d{9}$/;
        if (!mobileRegex.test(mobile.trim())) {
            errors.push({
                field: "mobile",
                message: "Invalid mobile number. Must be a 10-digit number starting with 6-9."
            });
        }
    }
    
    // Address (Optional)
    if (address !== undefined && address.trim() !== "") {
        if (address.trim().length > 250) {
            errors.push({
                field: "address",
                message: "Address cannot exceed 250 characters."
            });
        }
    }    

    req.validationErrors = errors;
    next();
};

const passwordValidator = (req, res, next) => {
    const errors = [];
    const { currentPassword, newPassword } = req.body;

    // Current Password (Required)
    if (!currentPassword || currentPassword.trim() === "") {
        errors.push({
            field: "currentPassword",
            message: "Current password is required."
        });
    }

    // New Password (Required)
    if (!newPassword || newPassword.trim() === "") {
        errors.push({
            field: "newPassword",
            message: "New password is required."
        });
    } else if (newPassword.length < 6) {
        errors.push({
            field: "newPassword",
            message: "New password must be at least 6 characters long."
        });
    }

    req.validationErrors = errors;
    next();
};

const allowedRoles = ["Admin", "User", "Guest"];
const createUserValidator = (req, res, next) => {
    const errors = [];
    const { username, email, role } = req.body;

    // Username (Required)
    if (!username || username.trim() === "") {
        errors.push({
            field: "username",
            message: "Username is required."
        });
    } else if (username.trim().length < 3 || username.trim().length > 30) {
        errors.push({
            field: "username",
            message: "Username must be between 3 and 30 characters."
        });
    }

    // Email (Required)
    if (!email || email.trim() === "") {
        errors.push({
            field: "email",
            message: "Email is required."
        });
    } else {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            errors.push({
                field: "email",
                message: "Invalid email address."
            });
        }
    }

    if (role && !allowedRoles.includes(role.trim())) {
        errors.push({
            field: "role",
            message: "Role must be one of: admin, user, guest."
        });
    }

    req.validationErrors = errors;
    next();
};

const updateUserValidator = (req, res, next) => {
    const errors = [];
    const { email, role, address } = req.body;

    // Email (Optional)
    if (email && email.trim() !== "") {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            errors.push({
                field: "email",
                message: "Invalid email address."
            });
        }
    }

    // Role (Optional)
    if (role && !allowedRoles.includes(role.trim())) {
        errors.push({
            field: "role",
            message: "Role must be one of: admin, user, guest."
        });
    }

    // Address (Optional)
    if (address && address.trim() !== "") {
        if (address.trim().length > 255) {
            errors.push({
                field: "address",
                message: "Address cannot exceed 255 characters."
            });
        }
    }

    req.validationErrors = errors;
    next();
};

module.exports = {
    profileValidator, passwordValidator, createUserValidator, updateUserValidator
};