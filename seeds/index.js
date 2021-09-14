if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const Campground = require('../models/campground');
//used for generating random imaginary campground data
const cities = require('./cities');
const { namePrefix, nameSuffix } = require('./nameHelpers');
//for the database connection
const mongoose = require('mongoose');
const dbUrl = process.env.db_url || 'mongodb://localhost:27017/yelp-camp';

mongoose.connect(dbUrl);

//inform us when there is an error and...
mongoose.connection.on('error', console.error.bind(console, 'there is an error in connection:'));
//...once the connection is esablished
mongoose.connection.once('open', () => {
    console.log("Database successfully connected!")
    console.log(dbUrl);
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
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 30) + 10;
        const newCamp = new Campground({
            //change to your user id
            author: '61420c29eb5c86bbb25daf8f',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,

            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },

            title: `${getRandomElement(namePrefix)} ${getRandomElement(nameSuffix)}`,

            image: 'https://source.unsplash.com/collection/483251',
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc id arcu ut turpis maximus malesuada nec non ante. Maecenas posuere sed neque vel porta. Vivamus blandit gravida elementum. Mauris sit amet dolor ac tortor imperdiet luctus. Maecenas sagittis vitae ligula ut finibus. Integer ut orci sit amet neque vehicula tempus. Duis tempus purus ipsum, ac finibus urna dignissim eget. Suspendisse luctus vehicula maximus. Maecenas lacinia libero sit amet mauris varius, sit amet euismod erat interdum.",
            
            price
        })

        await newCamp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});