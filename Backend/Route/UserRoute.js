const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const userController = require("../Controller/UserController");
const { authUser } = require("../Middleware/AuthMiddleware");

router.post('/register', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname')
        .isLength({ min: 3 })
        .withMessage('First name must be at least 3 characters long'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
], userController.registerUser);

router.post('/login', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
], userController.loginUser);

router.get('/profile', authUser, userController.getUserProfile);
router.get('/logout', authUser, userController.logOutUser);

module.exports = router;
