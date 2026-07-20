const loginValidator = (req, res, next) => {

    const errors = [];

    const { email, password } = req.body;

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

    if (!password || password.trim() === "") {
        errors.push({
            field: "password",
            message: "Password is required"
        });
    }

    req.validationErrors = errors;
    next();
}

module.exports = loginValidator;