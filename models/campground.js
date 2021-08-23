const mongoose = require('mongoose');

const campGroundSchema = new mongoose.Schema({
    title : String,
    price : String,
    description : String,
    location : String
});

const Campground = mongoose.model('Campground', campGroundSchema);

module.exports = Campground;

