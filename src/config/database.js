const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect('mongodb+srv://devsarthakhotline:24wfj6rGXQOz3xH6@namastenode.b6czamu.mongodb.net/devTinder');
};

module.exports = connectDB;