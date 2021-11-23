const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');

// to get the signup form
router.get('/register', (req, res) => {
    res.render('auth/signup', { message: req.flash('error') });
})

// registration of user
router.post('/register', async (req, res) => {

    try{
        const user = {
            firstName: req.body.firstname,
            lastName: req.body.lastname,
            email: req.body.email,
            username: req.body.username // we have to use username field when we are using local startegy as it looks 
            // up for it
        }
        const newUser = await User.register(user, req.body.password);
        res.redirect('/login');
    }
    catch (e) {
        req.flash('error', e.message);
        console.log(e);
        res.redirect('/register');
    }
})

// to get the login page
router.get('/login', (req, res) => {
    res.render('auth/login');
})

// login the user
router.post('/login', passport.authenticate('local',
     {
        failureRedirect: '/login', 
    }), (req, res) => {
        res.redirect('/');
    }
);

// Logout user
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
})

module.exports = router;