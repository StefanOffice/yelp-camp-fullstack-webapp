const mongoose = require('mongoose');

//create a schema for mongoose
const reviewSchema = new mongoose.Schema({
    body : String,
    rating : Number,
    author: {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }
});

//create a model from above defined schema
const Review = mongoose.model('Review', reviewSchema);

//export the model
module.exports = Review;