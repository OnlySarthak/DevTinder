const express = require('express');
const auth = require('../middleware/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

const requestRouter = express.Router();

requestRouter.get('/request/send/:status/:userId', auth, async (req, res) => {
    try {
        
        const fromUserId = req.user._id;
        const toUserId = req.params.userId;
        const status = req.params.status;

        if( !['intrested','ignored'].includes(status) ){
            throw new Error("invalid status " + status);
        }

        //check toUserId is exist
        const isToUserExist = User.findOne({_id :toUserId});
        if(!isToUserExist){
            res.status(400).send("Invalid User");
        }

        //check exiting documents
        const isExistingRequestPresent = await ConnectionRequest.findOne({
            $or : [
                { fromUserId , toUserId},
                { fromUserId : toUserId , toUserId : fromUserId}
            ]
        })

        if(isExistingRequestPresent){
            throw new Error("Request connecction already exist...");
        }

        //declare and define new connection request object
        const Connection = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });
        
        await Connection.save();   
        
        // console.log(connectionSchema);
        res.send({
            message : 'Your request created successfully',
            Connection
        });
    } catch (err) {
        res.status(400).send(err.message);
    }
});



module.exports = requestRouter;