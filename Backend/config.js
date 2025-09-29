const mongoose = require('mongoose');
require('dotenv').config();

const connection = mongoose.connect(process.env.MONGO_URL, {
}).then(() => {
    console.log('MongoDB connected successfully');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);  // Exit process with failure if MongoDB connection fails
});
module.exports = connection