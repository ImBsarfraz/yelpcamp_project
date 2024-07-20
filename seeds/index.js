const mongoose = require('mongoose');
const cities = require('./cities');
const {places,descriptors,images} = require('./seedHelpers');
const Campground = require("../models/campground");

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i=0;i<300;i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        
        const camp = new Campground({
          // your user id
            author:'6693650acc94b3bae1e3cf29',
            location:`${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description:'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tempora sunt officiis earum, reiciendis cupiditate dignissimos nulla! Magni quisquam itaque tempora aperiam, maiores voluptate blanditiis aspernatur quas. Eveniet quasi officia deleniti.',
            price,
            geometry: {
              type: "Point",
              coordinates: [
                cities[random1000].longitude,
                cities[random1000].latitude,
              ]
            },
            images: [
                {
                  url: 'https://res.cloudinary.com/dg1gtq2mp/image/upload/v1721023038/YelpCamp/aaxt8npr66tnhq80nhej.jpg',  
                  filename: 'YelpCamp/aaxt8npr66tnhq80nhej',
                },
                {
                  url: 'https://res.cloudinary.com/dg1gtq2mp/image/upload/v1721023043/YelpCamp/ejcp2stf5ilje7edlo8t.jpg',  
                  filename: 'YelpCamp/ejcp2stf5ilje7edlo8t',
                },
                {
                  url: 'https://res.cloudinary.com/dg1gtq2mp/image/upload/v1721023047/YelpCamp/yrvzc5evy65g6mjv3jgs.jpg',  
                  filename: 'YelpCamp/yrvzc5evy65g6mjv3jgs',
                }
              ]
            // images:`${sample(images)}`
        })
        await camp.save();
    }
}

seedDB().then(()=>{
    mongoose.connection.close();
});