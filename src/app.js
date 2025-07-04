const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const connectDB = require('./config/database');
const User = require('./models/user');
const { validateSignUpData } = require('./utils/validation');

app.use(express.json()); // Middleware to parse JSON bodies

app.post('/register', async (req, res) => {
    try {
        // Check if the user already exists
        const existingUser = await User.find({ emailId: req.body.emailId });
        if (existingUser.length > 0) {  
            return res.status(400).send("User already exists");
    }

    //validate the user data
    validateSignUpData(req);

    //encrypt the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    
    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        emailId: req.body.emailId,
        password: hashedPassword, // Store the hashed password
        age: req.body.age,
        gender: req.body.gender
    });

        await user.save();
        res.status(201).send("User registered successfully");
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).send(error.message);
    }
});

app.post('/login', async (req, res) => {
    try {
        // Find the user by emailId
        const user = await User.findOne({ emailId: req.body.emailId });
        if (!user) {  
            return res.status(404).send("Invalid credentials");
        }

        // //check if the password is correct
        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send("Invalid credentials");
        }
        else {
            res.status(200).send("Login successful");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

    
app.post('/user', async (req, res) => {
    try {
        const users = await User.find({emailId : req.body.emailId});
        
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send(error.message);
    }
});

app.get('/feed', async (req, res) => {
    const feedData = await user.find();
    try {
        res.status(200).json(feedData);
    } catch (error) {
        console.error("Error fetching feed data:", error);
        res.status(500).send(error.message);
    }
});

app.delete('/user', async (req, res) => {
    try {
        const users = await User.find({emailId : req.body.emailId});
        if (users.length === 0) {
            return res.status(404).send("User not found");
        }
        const id = users._id;
        await User.findByIdAndDelete(users);
        res.status(200).send("User deleted successfully");
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send(error.message);
    }
});

app.patch('/user/:userId', async (req, res) => {
    try {

        // Validate the request body
        const allowedUpdates = ['firstName', 'lastName', 'password', 'age', 'skills', 'about', 'photourl'];
        const updates = Object.keys(req.body);
        const isValidOperation = Object.keys(req.body).every((update) => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).send({ error: 'Invalid updates!' });
        }

        // Find the user by emailId
        const users = await User.find({emailId : req.body.emailId});
        
        if (users.length === 0) {  
            return res.status(404).send("User not found");
        }
        const id = users[0]._id.toString();
        
        await User.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        
        res.status(200).send("User updated successfully");
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send(error.message);
    }
});

connectDB().then(() => {
    console.log("Database connected successfully");
    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });
}).catch(err => {
    console.error("Failed to connect to the database:", err);
});

