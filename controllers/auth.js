const showRegisterForm = (req, res) => {
    res.render('auth/register');
}

const registerAndLogin = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const newUser = new User({ email, username });
        const regUser = await User.register(newUser, password);
        req.login(regUser, err =>{
            if(err) {
                return next(err);
            } else {
                req.flash('success', `Hello ${username}, you've been registered successfully!`);
                res.redirect('/campgrounds');
            }
        })

    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}

const showLoginForm = (req, res) => {
    res.render('auth/login');
}

const postLogin = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

const logout = (req, res) =>{
    req.logout();
    req.flash('success', "Goodbye!");
    res.redirect('/');
}


module.exports.showRegisterForm = showRegisterForm;
module.exports.registerAndLogin = registerAndLogin;
module.exports.showLoginForm = showLoginForm;
module.exports.postLogin = postLogin;
module.exports.logout = logout;
