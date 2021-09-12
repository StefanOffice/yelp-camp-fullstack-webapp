const mongoose = require('mongoose');
const Review = require('./review');

const imageSchema = new mongoose.Schema({
    url: String,
    filename: String
})

imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
})

const options = {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
}

const campgroundSchema = new mongoose.Schema({
    title: String,
    image: String,
    images: [imageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
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
}, options);

campgroundSchema.virtual('properties.popupMarkup').get(function () {
    return `<a href="/campgrounds/${this._id}">${this.title}</a>`;
})

campgroundSchema.post('findOneAndDelete', async function (deletedDoc) {
    if (deletedDoc) {
        await Review.deleteMany({ _id: { $in: deletedDoc.reviews } });
    }
})

const Campground = mongoose.model('Campground', campgroundSchema);

module.exports = Campground;