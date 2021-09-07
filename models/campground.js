const mongoose = require('mongoose');
const Review = require('./review');

const campgroundSchema = new mongoose.Schema({
    title : String,
    image : String,
    price : Number,
    description : String,
    location : String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

campgroundSchema.post('findOneAndDelete', async function(deletedDoc){
    if(deletedDoc){
        await Review.deleteMany({_id : { $in : deletedDoc.reviews}});
    }
})

const Campground = mongoose.model('Campground', campgroundSchema);

module.exports = Campground;