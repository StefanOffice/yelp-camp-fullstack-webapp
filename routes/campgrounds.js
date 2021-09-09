const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware')
const campController = require('../controllers/campgrounds')

const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({storage});


//route for getting a list of all campgrounds
router.get('/', catchAsync(campController.index));

//must be before 'campgrounds/:id' route otherwise it will see 'new' as something that goes to ':id'
router.get('/new', isLoggedIn, campController.showNewForm);
//second part of the creating a new campground process, form from new.ejs will hit this route
router.post('/', isLoggedIn, upload.array('image'), validateCampground, catchAsync(campController.createCampground));

//for displaying details of a chosen campground
router.get('/:id', catchAsync(campController.showCampDetails));

//route for edit form
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campController.showEditForm));
//route that edit form sends data to
router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campController.saveUpdatedInfo));

//route for deleting a campground
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campController.deleteCamp));


module.exports = router;