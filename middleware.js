const isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        //save where to user was trying to go
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'you must be signed in first');
        return res.redirect('/login');
    }
    next();
}

module.exports.isLoggedIn = isLoggedIn;