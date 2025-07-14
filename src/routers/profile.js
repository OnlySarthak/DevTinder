const express = require('express');
const auth = require('../middleware/auth');
const {validateEditProfileData} = require('../utils/validation');

const profileRouter = express.Router();

profileRouter.post('/profile/view',auth , (req, res) => {
    res.send({data : req.user});
});

profileRouter.patch('/profile/edit', auth, async (req, res) => {
    try {
        if (!validateEditProfileData(req)) {
            throw new Error("Invalid request...");
        }
        
        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key) => {
            loggedInUser[key] = req.body[key];
        });
        
        await loggedInUser.save();
        
        res.send({
            message : 'Your profile updated successfully',
            data : loggedInUser
        });

    } catch (err) {
        return res.status(400).json({ message: "Failed to save user", error: err.message });
    }
});

profileRouter.patch('/profile/password', auth, async (req, res) => {
    try {
        console.log(!req.body.password);
        
        if (!req.body.password) {
            throw new Error("Invalid request...");
        }

        const loggedInUser = req.user;
        loggedInUser.password = req.body.password;

        await loggedInUser.save();

        res.send('Your password updated successfully');
    } catch (err) {
        res.status(400).send("Invalid Request");
    }
});



module.exports = profileRouter;