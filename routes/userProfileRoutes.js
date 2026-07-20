const express = require('express')
const router = express.Router()

const {
    getUserProfile,
    updateUserProfile,
    updateUserPassword
} = require('../controllers/userProfile')

const {
    profileValidator, passwordValidator
} = require("../validators/userValidator");

const validationMiddleware = require('../middleware/validation')
const protect = require('../middleware/authenticate')
const restrictTo = require('../middleware/authorize')

router.use(protect);

router.get('/profile', restrictTo('Admin','User'), getUserProfile);
router.put('/profile', restrictTo('Admin','User'), profileValidator, validationMiddleware , updateUserProfile);
router.put('/change-password', restrictTo('Admin','User'), passwordValidator, validationMiddleware, updateUserPassword);

module.exports = router