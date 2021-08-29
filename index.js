const express = require('express');
const app = express();
const Campground = require('./models/campground');
const Review = require('./models/review');
const ExpressError = require('./utils/ExpressError');
const {campgroundSchema, reviewSchema} = require('./schemas.js');
//using method-override to be able to send requests other than put and post from forms
const methodOverride = require('method-override');
//for setting up and reusing layout boilerplate
const ejsMate = require('ejs-mate');
//for the database connection
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/yelp-camp');


//inform us when there is an error and...
mongoose.connection.on('error', console.error.bind(console, "there is an error in connection:"));
//...once the connection is esablished
mongoose.connection.once('open', () => {
    console.log("Database successfully connected!")
});


//using path to be able to start the server from any directory in terminal, without breaking anything
const path = require('path');
const catchAsync = require('./utils/catchAsync');
const { join } = require('path');

//register server to start listening on port 3000
app.listen(3000, () => {
    console.log('Server running on port 3000');
});

//to enable usage on embedded javascript in html files
app.set('view engine', 'ejs');

//if this line is removed 'node intex.js' command in the terminal can only be run if we are currently in the project directory
app.set('views', path.join(__dirname, 'views'));

//need to specify this here so that body of the request gets parsed
app.use(express.urlencoded({ extended: true }));
//placing underscore just to avoid any possible name clashes
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

//most basic test response on home('/') page
app.get('/', (req, res) => {
    res.render('home.ejs');
});

app.get('/campgrounds', catchAsync(async (req, res) => {
    //get all the camps from db
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index.ejs', { campgrounds })
}));

//must be before 'campgrounds/:id' route otherwise it will see 'new' as something that goes to ':id'
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new.ejs');
});

//second part of the creating a new campground process, form from new.ejs will hit this route
app.post('/campgrounds', validateCampground, catchAsync(async (req, res, next) => {
    /*req.body is by default empty, but it gets parsed thanks to 
    this line: app.use(express.urlencoded({extended : true})); located above */
    const newCamp = new Campground(req.body.campground);
    await newCamp.save();
    res.redirect(`/campgrounds/${newCamp._id}`);
}));

//this will catch anything after /campgrounds/
// no error handling yet
app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    res.render('campgrounds/details.ejs', { campground });
}));

//route for edit form
app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit.ejs', { campground });
}));

//route that edit form sends data to
app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    //data is grouped under 'campground' so we can just use spread
    const updatedCamp = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true });
    res.redirect(`/campgrounds/${updatedCamp.id}`)
}));

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));

//a route for posting reviews
app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async(req,res)=>{
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

app.delete('/campgrounds/:campId/reviews/:revId', catchAsync(async(req,res) =>{
    const {campId, revId} = req.params;
    await Campground.findByIdAndUpdate(campId, {$pull: {reviews : revId}});
    await Review.findByIdAndDelete(revId);
    res.redirect(`/campgrounds/${campId}`);
}))

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