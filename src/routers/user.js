const express = require('express');
const auth = require('../middleware/auth');
const connectionRequest = require('../models/connectionRequest');

const userRouter = express.Router();

const USER_SAFE_DATA = 'firstName LastName gender about skills';

//get pending data about people'ss intrested connection to me 
userRouter.get('/user/request/received', auth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const intrestedRequestList = await connectionRequest.find({
            toUserId : loggedInUser._id,
            status : "intrested"
        }).populate("fromUserId", 'firstName lastName')
        .populate("fromUserId", USER_SAFE_DATA);

        if(intrestedRequestList.length ==0){
            return res.send("you are not intrested for everyone");
        }

        res.send({
            message : "data fetched successfuly",
            data : intrestedRequestList
        })
    } catch (error) {
        res.status(400).send("invalid request");
    }
});

//get data about accepted connections
userRouter.get('/user/connections', auth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const intrestedRequestList = await connectionRequest.find({
        $or : [
            {  toUserId : loggedInUser._id,status : "accepted"},
            {  fromUserId : loggedInUser._id,status : "accepted"}
        ]}).populate("fromUserId", USER_SAFE_DATA)
        .populate("toUserId", USER_SAFE_DATA);

        if(intrestedRequestList.length ==0){
            return res.send("you have no acceptance");
        }

        const data = intrestedRequestList.map((row) =>{
            if(loggedInUser._id.toString() === row.fromUserId._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
        });

        res.send({
            message : "data fetched successfuly",
            data : data
        })
    } catch (error) {
        res.status(400).send("invalid request");
    }
});

module.exports = userRouter;