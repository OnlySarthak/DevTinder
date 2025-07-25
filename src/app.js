const express = require('express');
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file
const { createServer } = require("http");
const initalizeSocket = require("./utils/initializeSocket");

const app = express();

app.use(cors({
    origin : 'http://localhost:5173',
    credentials : true
}));           //Middleware for corrs allowance and whielisting
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser()); // Middleware to parse cookies

const auth = require('./routers/auth');
const profile = require('./routers/profile');
const request = require('./routers/request');
const user = require('./routers/user');

app.use('/', auth, profile, request, user);

const Server = createServer(app);

initalizeSocket(Server);

connectDB().then(() => {
    console.log("Database connected successfully");
    Server.listen(process.env.PORT , () => {
        console.log("Server is running on port "+process.env.PORT);
    });
}).catch(err => {
    console.error("Failed to connect to the database:", err);
});

