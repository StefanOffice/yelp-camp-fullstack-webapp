const express = require('express');

// merge params to get the params from the prefix aswell
const router = express.Router({mergeParams:true});
const catchAsync = require('../utils/catchAsync');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');
const reviewController = require('../controllers/reviews');



//a route for posting reviews
router.post('/', isLoggedIn, validateReview, catchAsync(reviewController.createReview))

//a route for deleting a specific review
router.delete('/:revId', isLoggedIn, isReviewAuthor, catchAsync(reviewController.deleteReview))

module.exports = router;