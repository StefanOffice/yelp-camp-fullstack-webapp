const express = require('express');
const app = express();
const Campground = require('./models/campground');
//for the database connection
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/yelp-camp')

//inform us when there is an error and...
mongoose.connection.on('error', console.error.bind(console, 'there is an error in connection:'));
//...once the connection is esablished
mongoose.connection.once('open', () => {
    console.log("Database successfully connected!")
}) 


//using path to be able to start the server from any directory in terminal, without breaking anything
const path = require('path');

//register server to start listening on port 3000
app.listen(3000, ()=> {
    console.log('Server running on port 3000');
});

//to enable usage on embedded javascript in html files later on, setting now so i don't forget
app.set('view engine', 'ejs');

//if this line is removed 'node intex.js' command in the terminal can only be run if we are currently in the project directory
app.set('views', path.join(__dirname, 'views'));

//most basic test response on home('/') page
app.get('/', (req,res) => {
    res.render('home.ejs');
});

//another testing route, this time for database interaction
app.get('/newcampground', async (req, res) => {
    //create a new camp
    const newCamp = new Campground({title: 'Campus Primus', description : 'awesome camping!'})
    //save it to the database(and wait untill it's saved)
    await newCamp.save();
    //then send the object back to client
    res.send(newCamp);
})