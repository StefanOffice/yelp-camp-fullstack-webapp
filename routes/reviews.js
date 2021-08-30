const express = require('express');

// merge params to get the params from the prefix aswell
const router = express.Router({mergeParams:true});
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const {reviewSchema} = require('../schemas.js');
const Campground = require('../models/campground');
const Review = require('../models/review');


const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

//a route for posting reviews
router.post('/', validateReview, catchAsync(async(req,res)=>{
    //find the campground
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    //add the review to the campground
    campground.reviews.push(review);
    //save both to database
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

//a route for deleting a specific review
router.delete('/:revId', catchAsync(async(req,res) =>{
    const {id, revId} = req.params;
    //find the campground and delete any review that has the specified id from the reviews array
    await Campground.findByIdAndUpdate(id, {$pull: {reviews : revId}});
    //then delete the review itself
    await Review.findByIdAndDelete(revId);
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;