const registerValidator = (req, res, next) => {

    const errors = [];

    const { name, email, password, confirmPassword } = req.body;

    if (!name || name.trim() === "") {
        errors.push({
            field: "name",
            message: "Name is required"
        });
    } else {
        const nameRegex = /^[a-zA-Z0-9 ]{3,30}$/;        
        if (!nameRegex.test(name)) {
            errors.push({
                field: "name",
                message: "Name must be 3-30 characters and contain only letters and space."
            });
        }
    }

    if (!email || email.trim() === "") {
        errors.push({
            field: "email",
            message: "Email is required"
        });
    } else {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailRegex.test(email)) {
            errors.push({
                field: "email",
                message: "Invalid email format"
            });
        }
    }

    if (!password) {
        errors.push({
            field: "password",
            message: "Password is required"
        });
    }

    if (password && password.length < 6) {
        errors.push({
            field: "password",
            message: "Password must be at least 6 characters"
        });
    }

    if (password !== confirmPassword) {
        errors.push({
            field: "confirmPassword",
            message: "Passwords do not match"
        });
    }

    req.validationErrors = errors;
    next();
}

module.exports = registerValidator;