const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const connectDB = require('./config/database');
const User = require('./models/user');
const { validateSignUpData } = require('./utils/validation');
const cookieParser = require('cookie-parser');
const auth = require('./middleware/auth');

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser()); // Middleware to parse cookies

app.post('/register', async (req, res) => {
    try {
        
        // Check if the user already exists
        const existingUser = await User.findOne({ emailId: req.body.emailId });
        
        // If user already exists, return an error  
        if (existingUser) {
            return res.status(400).send("User already exists with this emailId");   
        }
        //validate the user data
        validateSignUpData(req);
        
        //encrypt the password
        const hashedPassword = await bcrypt.hash(req.body.password , 10);
        
        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            emailId: req.body.emailId,
            password: hashedPassword, // Store the hashed password
            age: req.body.age,
            gender: req.body.gender
        });
        
        await user.save(); // Save the user to the database
        res.status(201).send("User registered successfully");

    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).send(error.message);
    }
});

app.post('/login', async (req, res) => {
    try {
        // Find the user by emailId
        const user = await User.findOne({ emailId: req.body?.emailId });
        if (!user) {  
            return res.status(404).send("Invalid credentials");
        }

        // //check if the password is correct
        const isPasswordValid = await user.verifyPassword(req.body?.password);
        if (!isPasswordValid) {
            return res.status(401).send("Invalid credentials");
        }
        else {
            const token = await user.generateAuthToken(); // Generate a token for the user
            //send cookies back to the client
            res.cookie('token', token);
            res.status(200).send("Login successful");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});
    
app.post('/profile',auth , (req, res) => {
    res.send(req.user);
});

connectDB().then(() => {
    console.log("Database connected successfully");
    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });
}).catch(err => {
    console.error("Failed to connect to the database:", err);
});

