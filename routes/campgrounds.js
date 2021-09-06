const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {campgroundSchema} = require('../schemas.js');
const {isLoggedIn} = require('../middleware')

const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');



const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}


//route for getting a list of all campgrounds
router.get('/', catchAsync(async (req, res) => {
    //get all the camps from db
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index.ejs', { campgrounds })
}));

//must be before 'campgrounds/:id' route otherwise it will see 'new' as something that goes to ':id'
router.get('/new', isLoggedIn, (req, res) => {
        res.render('campgrounds/new.ejs');
});

//second part of the creating a new campground process, form from new.ejs will hit this route
router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    const newCamp = new Campground(req.body.campground);
    await newCamp.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${newCamp._id}`);
}));

//for displaying details of a chosen campground
router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    if(!campground){
        req.flash('error', 'That campground does not exist');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/details.ejs', { campground });
}));

//route for edit form
router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if(!campground){
        req.flash('error', 'That campground does not exist');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit.ejs', { campground });
}));

//route that edit form sends data to
router.put('/:id', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    //data is grouped under 'campground' so we can just use spread
    const updatedCamp = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true });
    req.flash('success', 'Successfully updated the campground!')
    res.redirect(`/campgrounds/${updatedCamp._id}`)
}));


//route for deleting a campground
router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campground deleted!');
    res.redirect('/campgrounds');
}));

module.exports = router;