const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const authController = require('../controllers/auth');

//group same routes with different http verbs together
router.route('/register')
    .get(authController.showRegisterForm)
    .post(catchAsync(authController.registerAndLogin));


const passOptions = { failureFlash: true, failureRedirect: '/login' }
router.route('/login')
    .get(authController.showLoginForm)
    .post( passport.authenticate('local', passOptions), authController.postLogin);

router.get('/logout', authController.logout);

module.exports = router;