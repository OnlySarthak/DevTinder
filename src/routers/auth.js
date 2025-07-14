const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user')
const { validateSignUpData } = require('../utils/validation');

const authRouter = express.Router();

authRouter.post('/register', async (req, res) => {
    try {
        
        // Check if the user already exists
        const existingUser = await User.find({ emailId: req.body.emailId });
        
        // If user already exists, return an error  
        if (existingUser.length > 0) {
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
            gender: req.body.gender,
            about:req.body.about,
            photourl : req.body.photourl
        });
        
        await user.save(); // Save the user to the database
        res.status(201).send({
            message : "User registered successfully",
            data : user
        });

    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).send(error.message);
    }
});

authRouter.post('/login', async (req, res) => {
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

            res.status(200).json({message : "Login successful",
                data : user
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

authRouter.post('/logout', (req, res) => {
  res.clearCookie('token', 
    {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    path: '/', // whatever was used originally
  }
);
  res.json({ message: 'Logout successful' });
});


module.exports = authRouter;
