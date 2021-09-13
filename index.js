if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}


const express = require('express');
const ExpressError = require('./utils/ExpressError');
//using method-override to be able to send requests other than put and post from forms
const methodOverride = require('method-override');
//for setting up and reusing layout boilerplate
const ejsMate = require('ejs-mate');
//using path to be able to start the server from any directory in terminal, without breaking anything
const path = require('path');
const flash = require('connect-flash');
//authentication things
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

//for the database connection
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/yelp-camp');
//inform us when there is an error and...
mongoose.connection.on('error', console.error.bind(console, "there is an error in connection:"));
//...once the connection is esablished
mongoose.connection.once('open', () => {
    console.log("Database successfully connected!")
});

//settings for the session
const session = require('express-session');
const sessionConfig = {
    name: 'notacookie',
    secret: 'notaverygoodsecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //a week in milliseconds
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true, // a bit of extra security
        // secure: true //localhost is not https, uncomment this when deploying tho
    }
}


//require the routes that are now separately listed
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const authRoutes = require('./routes/auth');

const app = express();


//to enable usage on embedded javascript in html files
app.set('view engine', 'ejs');
//if this line is removed 'node intex.js' command in the terminal can only be run if we are currently in the project directory
app.set('views', path.join(__dirname, 'views'));
//need to specify this here so that body of the request gets parsed
app.use(express.urlencoded({ extended: true }));
//placing underscore just to avoid any possible name clashes
app.use(methodOverride('_method'));
//serve the assets from the public directory so that they can be accesed from other files
app.use(express.static(path.join(__dirname, 'public')));

app.use(mongoSanitize());

//security definitions, where can content be pulled from
app.use(helmet());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net"
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net"
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/"
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/brodzef/", 
                "https://images.unsplash.com/",
                "https://source.unsplash.com/"
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.use(session(sessionConfig));
app.use(flash());
//passport config
app.use(passport.initialize());
//for persistent login sessions, must come after app.use(session());
app.use(passport.session());

//the methods called below on User come from passport-local-mongoose
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.engine('ejs', ejsMate);

//pass this data to all the templates
app.use((req, res, next) => {
    //req.user is created and populated by passport
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

//use the rotes that i moved to campgrounds.js
//add prefix /campgrounds to any route defined there
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/', authRoutes);

//home page route
app.get('/', (req, res) => {
    res.render('home.ejs');
});


//a catch all route for any other non-defined route
//passes the error to the handler below
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

// final error handling 
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) {
        err.message = "Something went wrong!";
    }
    res.status(statusCode);
    res.render('error.ejs', { err });
});

//register server to start listening on port 3000
app.listen(3000, () => {
    console.log('Server running on port 3000');
});