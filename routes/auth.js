const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const passport = require('passport');
const authController = require('../controllers/auth');

router.get('/register', authController.showRegisterForm);

router.post('/register', catchAsync(authController.registerAndLogin));

router.get('/login', authController.showLoginForm);

const passOptions = {
    failureFlash: true,
    failureRedirect : '/login'
}

router.post('/login', passport.authenticate('local', passOptions), authController.postLogin);

router.get('/logout', authController.logout);

module.exports = router;