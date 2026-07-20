const express = require('express');
const router = express.Router();

const {
    getUserProfile,
    updateUserProfile,
    updateUserPassword
} = require('../controllers/userProfile')

const {
    profileValidator, passwordValidator
} = require("../validators/userValidator");

const validationCheck = require('../middleware/validation');
const protect = require('../middleware/authenticate');
const restrictTo = require('../middleware/authorize');

router.use(protect);

router.get('/profile', restrictTo('Admin','User'), getUserProfile);
router.put('/profile', restrictTo('Admin','User'), profileValidator, validationCheck, updateUserProfile);
router.put('/change-password', restrictTo('Admin','User'), passwordValidator, validationCheck, updateUserPassword);

module.exports = router