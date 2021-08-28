const Joi = require('joi');

//this is not a mongoose schema, but a joi one
//it will validate data against it, before sending it to db
const campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required()
})

const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().min(1).max(5).required(),
        body: Joi.string().required()
    }).required()
});


module.exports.campgroundSchema = campgroundSchema;
module.exports.reviewSchema = reviewSchema;