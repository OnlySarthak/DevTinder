const express = require('express');
// const auth = require('./middleware/auth')
const app = express();
const connectDB = require('./config/database');
const User = require('./models/user');
app.use(express.json()); // Middleware to parse JSON bodies

app.post('/register', async (req, res) => {
    const userData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        emailId: req.body.emailId,
        password: req.body.password,
    };

    const user = new User(userData);

    try{
        await user.save();
        res.status(201).send("User registered successfully");
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).send("Internal Server Error");
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

