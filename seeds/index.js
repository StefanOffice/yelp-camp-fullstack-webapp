const Campground = require('../models/campground');
//used for generating random imaginary campground data
const cities = require('./cities');
const { namePrefix, nameSuffix } = require('./nameHelpers');
//for the database connection
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/yelp-camp');

//inform us when there is an error and...
mongoose.connection.on('error', console.error.bind(console, 'there is an error in connection:'));
//...once the connection is esablished
mongoose.connection.once('open', () => {
    console.log("Database successfully connected!")
});

const getRandomElement = (array) => {
    const rand = Math.floor(Math.random() * array.length);
    return array[rand];
}

//Generate random seed data for the database
const seedDB = async () => {
    //CAREFULL - this will delete all data from this database
    await Campground.deleteMany({});

    //once database in empty, populate it with random data
    //to be replaced with real data
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 30) + 10;
        const newCamp = new Campground({
            author: '61378b089e0c799ef85b3623',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${getRandomElement(namePrefix)} ${getRandomElement(nameSuffix)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Error illo voluptatum quos, qui temporibus belle eveniets?",
            price
        })
        
        await newCamp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});