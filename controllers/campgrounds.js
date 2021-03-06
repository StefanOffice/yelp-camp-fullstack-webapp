const Campground = require('../models/campground');
const {cloudinary} = require("../cloudinary");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.mapbox_token;
const geocoder = mbxGeocoding({accessToken:mapBoxToken});

const index = async (req, res) => {
    //get all the camps from db
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index.ejs', { campgrounds })
}

const showNewForm = (req, res) => {
    res.render('campgrounds/new.ejs');
}

const createCampground = async (req, res, next) => {
    //coordinates obtained here will be reversed
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();
    const newCamp = new Campground(req.body.campground);
    //add the geojson data 
    newCamp.geometry = geoData.body.features[0].geometry;
    newCamp.images = req.files.map(f => ({
        url: f.path,
        filename: f.filename
    }));
    newCamp.author = req.user._id;
    await newCamp.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${newCamp._id}`);
}

const showCampDetails = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({ //this is saying 'populate all the reviews of the campground
        path: 'reviews',
        populate: { // then populate authors for each review
            path: 'author'
        }
    }).populate('author'); // then populate the author of the campground
    if (!campground) {
        req.flash('error', 'That campground does not exist');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/details.ejs', { campground });
}

const showEditForm = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'That campground does not exist');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit.ejs', { campground });
}

const saveUpdatedInfo = async (req, res) => {
    const { id } = req.params;
    //data is grouped under 'campground' in the body so we can just use spread
    const updatedCamp = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true });

    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();
    updatedCamp.geometry = geoData.body.features[0].geometry;

    //read the new images and add them to array
    const newImages = req.files.map(f => ({
        url: f.path,
        filename: f.filename
    }));
    updatedCamp.images.push(...newImages);

    
    if (req.body.deleteImages) {
        //delete images on cloudinary
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }

        //deletes image urls from mongo
        await updatedCamp.updateOne({
            $pull: {
                images: { //pull out of the images array
                    filename: { //where the filename on each image
                        $in: req.body.deleteImages //is in the deleteImages array
                    }
                }
            }
        })
    }

    await updatedCamp.save();
    req.flash('success', 'Successfully updated the campground!')
    res.redirect(`/campgrounds/${updatedCamp._id}`)
}

const deleteCamp = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campground deleted!');
    res.redirect('/campgrounds');
}

module.exports.index = index;
module.exports.showNewForm = showNewForm;
module.exports.createCampground = createCampground;
module.exports.showCampDetails = showCampDetails;
module.exports.showEditForm = showEditForm;
module.exports.saveUpdatedInfo = saveUpdatedInfo;
module.exports.deleteCamp = deleteCamp;

