const express = require('express');
const app = express();
const Campground = require('./models/campground');
//for the database connection
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/yelp-camp')

//inform us when there is an error and...
mongoose.connection.on('error', console.error.bind(console, "there is an error in connection:"));
//...once the connection is esablished
mongoose.connection.once('open', () => {
    console.log("Database successfully connected!")
}) 


//using path to be able to start the server from any directory in terminal, without breaking anything
const path = require('path');
const { find } = require('./models/campground');
const { PRIORITY_ABOVE_NORMAL } = require('constants');

//register server to start listening on port 3000
app.listen(3000, ()=> {
    console.log('Server running on port 3000');
});

//to enable usage on embedded javascript in html files later on, setting now so i don't forget
app.set('view engine', 'ejs');

//if this line is removed 'node intex.js' command in the terminal can only be run if we are currently in the project directory
app.set('views', path.join(__dirname, 'views'));

//need to specify this here so that body of the request gets parsed
app.use(express.urlencoded({extended : true}));

//most basic test response on home('/') page
app.get('/', (req,res) => {
    res.render('home.ejs');
});

app.get('/campgrounds', async(req, res) => {
    //get all the camps from db
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index.ejs', {campgrounds})
});

//must be before 'campgrounds/:id' route otherwise it will see 'new' as something that goes to ':id'
app.get('/campgrounds/new', (req,res) => {
    res.render('campgrounds/new.ejs');
})

app.post('/campgrounds', async(req, res) =>{
    /*req.body is by default empty, but it gets parsed thanks to 
    this line: app.use(express.urlencoded({extended : true})); located above */
    const newCamp = new Campground(req.body.campground);
    await newCamp.save();
    res.redirect(`/campgrounds/${newCamp._id}`);
})

//this will catch anything after /campgrounds/
// no error handling yet
app.get('/campgrounds/:id', async(req,res) =>{
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/details.ejs', {campground})
});

