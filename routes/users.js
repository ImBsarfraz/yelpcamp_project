const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');
const users = require('../controllers/users');

router.route('/register')
    .get(users.renderRegisterForm)
    .post(users.registerUser);

router.route('/login')
    .get(users.renderLoginForm)
    .post(storeReturnTo, passport.authenticate('local', {failureFlash:true, failureRedirect:'/login'}) , users.loginUser);

router.get('/logout', users.logOut); 

module.exports = router;