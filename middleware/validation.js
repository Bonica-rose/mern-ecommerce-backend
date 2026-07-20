const validation = (req, res, next) => {

    if (req.validationErrors.length > 0) {
        return res.status(400).json({
            success: false,
            errors: req.validationErrors
        });
    }

    next();

}

module.exports = validation;