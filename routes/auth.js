const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const passport = require('passport');

router.get('/register', (req, res) => {
    res.render('auth/register');
})

router.post('/register', async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const newUser = new User({ email, username });
        const regUser = await User.register(newUser, password);
        req.flash('success', `Hello ${username}, you've been registered successfully!`);
        res.redirect('/campgrounds');
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
});

router.get('/login', (req, res) => {
    res.render('auth/login');
})

const passOptions = {
    failureFlash: true,
    failureRedirect : '/login'
}

router.post('/login', passport.authenticate('local', passOptions), (req, res) => {

    req.flash('success', 'Welcome back!');
    res.redirect('/campgrounds');
})

router.get('/logout', (req, res) =>{
    req.logout();
    req.flash('success', "Goodbye!");
    res.redirect('/');
})

module.exports = router;