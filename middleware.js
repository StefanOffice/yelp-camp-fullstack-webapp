const Campground = require('./models/campground');
const Review = require('./models/review');
const {campgroundSchema, reviewSchema} = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');

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

const isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        //save where to user was trying to go
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'you must be signed in first');
        return res.redirect('/login');
    }
    next();
}

const isAuthor = async(req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if(!camp.author.equals(req.user._id)){
        req.flash('error', "You don't have the permission to do that!");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

const isReviewAuthor = async(req, res, next) => {
    const { id, revId } = req.params;
    const review = await Review.findById(revId);
    if(!review.author.equals(req.user._id)){
        req.flash('error', "You don't have the permission to do that!");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.isLoggedIn = isLoggedIn;
module.exports.isAuthor = isAuthor;
module.exports.validateCampground = validateCampground;
module.exports.validateReview = validateReview;
module.exports.isReviewAuthor = isReviewAuthor;