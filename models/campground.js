const mongoose = require('mongoose');

const campgroundSchema = new mongoose.Schema({
    title : String,
    image : String,
    price : Number,
    description : String,
    location : String,
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

const Campground = mongoose.model('Campground', campgroundSchema);

module.exports = Campground;
