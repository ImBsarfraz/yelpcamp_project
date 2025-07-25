const User = require('../models/user');

module.exports.renderRegisterForm = (req,res) => {
    res.render('user/register');
}
module.exports.registerUser = async(req,res) => {
    try
    {
    const { email,username,password } = req.body;
    const user = new User({email,username});
    const registeredUser = await User.register(user,password);
    req.login(registeredUser, err => {
        if(err) return next(err);
        req.flash('success', 'Welcome To YelpCamp!');
        res.redirect('/campgrounds');
    })
    }
    catch(e) {
        req.flash('error',e.message);
        res.redirect('register');   
    }
};

module.exports.renderLoginForm = (req,res) => {
    res.render('user/login');
}

module.exports.loginUser = (req,res) => {
    req.flash('success', 'Welcome Back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}
module.exports.logOut = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}