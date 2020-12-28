const express = require('express');
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user')

const router = express.Router();

router.get('/register', (req, res) => {
    res.render('users/register');
})

router.post('/register', catchAsync(async (req, res) => {
    try {
        const {email, username, password} = req.body;
        const  user = new User({email, username})
        const newUser = await User.register(user, password)
        req.login(newUser, err => {
            if(err) return next(err)
            req.flash('success', 'Welcome to Camp Mapper');
            res.redirect('/campgrounds')
        })
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
}))

router.get('/login',  (req, res) => {
    res.render('users/login')
})

router.post('/login', 
            passport.authenticate('local', {failureFlash: true, failureRedirect:'/login'}), (req, res) => {
    req.flash('success', 'Welcome Back!');
    redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

router.get('/logout',  (req, res) => {
    req.logout();
    req.flash('success', 'Goodbye!');
    res.redirect('/campgrounds')
})



module.exports = router;

