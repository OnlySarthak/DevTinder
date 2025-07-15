const express = require('express');
const auth = require('../middleware/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

const requestRouter = express.Router();

requestRouter.post('/request/send/:status/:userId', auth, async (req, res) => {
    try {
        
        const fromUserId = req.user._id;    //current
        const toUserId = req.params.userId;
        const status = req.params.status;

        if( !['intrested','ignored'].includes(status) ){
            return res.status(200).send("invalid status " + status);
        }

        //check toUserId is exist
        const isToUserExist = User.findOne({_id :toUserId});
        if(!isToUserExist){
            return res.status(200).send("Invalid User");
        }

        //check exiting documents
        const isExistingRequestPresent = await ConnectionRequest.findOne({
            $or : [
                { fromUserId , toUserId},
                { fromUserId : toUserId , toUserId : fromUserId}
            ]
        })

        if(isExistingRequestPresent){
            return res.status(200).send("Request connecction already exist...");
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
            data : Connection
        });
    } catch (err) {
        res.status(400).send(err.message);
    }
});

requestRouter.post('/request/review/:status/:userId', auth, async (req, res) => {
    try {
        
        const fromUserId = req.params.userId;
        const toUserId = req.user._id;  //current logged user
        const status = req.params.status;

        //verify status
        if( !['accepted','rejected'].includes(status) ){
            return res.status(200).send("invalid status " + status);
        }

        //check exiting documents
        const isExistingRequestPresent = await ConnectionRequest.findOne({
            fromUserId,
            toUserId, //current
            status : 'intrested' 
        });
        if(!isExistingRequestPresent){
            return res.status(200).send("Invalid request.");
        }

        isExistingRequestPresent.status = status;
        
        await isExistingRequestPresent.save();   
        
        // console.log(connectionSchema);
        res.send({
            message : 'Your request updated successfully',
            isExistingRequestPresent
        });
    } catch (err) {
        res.status(400).send(err.message);
    }
});

requestRouter.delete('/request/delete/:_id',auth, async(req, res)=>{
    try {
        const deleteUserId = req.params._id;

        const deletedUserId =  await ConnectionRequest.findByIdAndDelete({
            _id : deleteUserId
        });

        if(deletedUserId){
            return res.status(200).json({message:"connection deleted successfuly"})
        }
        if(!deletedUserId){
            return res.status(404).json({message:"connection not found!"})
        }

    } catch (error) {
        res.status(400).send(err.message);
    }
})

module.exports = requestRouter;