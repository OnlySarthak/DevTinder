const express = require('express');
const auth = require('../middleware/auth');
const user = require('../models/user');
const Chat = require('../models/chat')

const chatMessages = express.Router();

chatMessages.get('/chat/:targetUserId', auth, async ( req, res ) => {
    try {
        const userId = req.user._id;
        const { targetUserId } = req.params;

        let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
        });

        if (!chat) {
            return res.send("new chat...");
        }

        //fetch targetUserId photourl and name
        const targetUserData = await user.findOne({
            _id: targetUserId
        }).select("firstName lastName photourl");

        res.send({
            message: "chat found",
            data: chat.messages.slice(-5),
            targetUserData
        });
        
    } catch (error) {
        return res.status(400).json({ message: "Failed to fetch chatting", error: error.message });
    }
})


module.exports = chatMessages;