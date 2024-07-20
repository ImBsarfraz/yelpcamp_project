const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 1010;

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define a schema for storing image URLs
const imageSchema = new mongoose.Schema({
  url: String,
});

const Image = mongoose.model('Image', imageSchema);

// Route to fetch a random image from Unsplash
app.get('/api/random-image', async (req, res) => {
  try {
    // Check if there's a cached image in the database
    const count = await Image.countDocuments();
    const random = Math.floor(Math.random() * count);
    const cachedImage = await Image.findOne().skip(random);

    if (cachedImage) {
      res.json({ url: cachedImage.url });
    } else {
      // Fetch a new random image from Unsplash API
      const response = await axios.get('https://api.unsplash.com/photos/random', {
        headers: {
          Authorization: 'Client-ID jjPzy1ndmwzBvfX_-yarO6LpDmr_akDrK3eex8GQwTQ',
        },
      });

      // Save the image URL to MongoDB
      const newImage = new Image({ url: response.data.urls.regular });
      await newImage.save();

      res.json({ url: response.data.urls.regular });
    }
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).json({ error: 'Failed to fetch image' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// second demo
// app.js
const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config(); // For loading environment variables from a .env file

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

// Define a schema for the image
const imageSchema = new mongoose.Schema({
    unsplash_id: String,
    url: String,
    description: String
});

// Create a model based on the schema
const Image = mongoose.model('Image', imageSchema);

// Route to fetch a random image from Unsplash
app.get('/random-image', async (req, res) => {
    try {
        const response = await axios.get('https://api.unsplash.com/photos/random', {
            params: {
                client_id: process.env.UNSPLASH_ACCESS_KEY
            }
        });

        const imageData = response.data;
        
        // Save image data to MongoDB (optional)
        const newImage = new Image({
            unsplash_id: imageData.id,
            url: imageData.urls.regular,
            description: imageData.alt_description
        });
        await newImage.save();

        res.json(imageData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})