const express = require('express');

// merge params to get the params from the prefix aswell
const router = express.Router({mergeParams:true});
const catchAsync = require('../utils/catchAsync');
const {validateReview, isLoggedIn} = require('../middleware');
const Campground = require('../models/campground');
const Review = require('../models/review');


//a route for posting reviews
router.post('/', isLoggedIn, validateReview, catchAsync(async(req,res)=>{
    //find the campground
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    //add the review to the campground
    campground.reviews.push(review);
    //save both to database
    await review.save();
    await campground.save();
    req.flash('success', 'Your review was successfully created!')
    res.redirect(`/campgrounds/${campground._id}`);
}))

//a route for deleting a specific review
router.delete('/:revId', catchAsync(async(req,res) =>{
    const {id, revId} = req.params;
    //find the campground and delete any review that has the specified id from the reviews array
    await Campground.findByIdAndUpdate(id, {$pull: {reviews : revId}});
    //then delete the review itself
    await Review.findByIdAndDelete(revId);
    req.flash('success', 'Review deleted!');
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;