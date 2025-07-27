const { Server } = require("socket.io");
const Chat = require("../models/chat");
const ConnectionRequest = require("../models/connectionRequest");

const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log("✅ User connected:", socket.id);

        socket.on("join", async ({ userId, targetUserId }) => {
            try {
                // verify users are already friends
                const connection = await ConnectionRequest.findOne({
                    $or: [
                        { fromUserId: userId, toUserId: targetUserId, status: "accepted" },
                        { fromUserId: targetUserId, toUserId: userId, status: "accepted" },
                    ],
                });

                if (!connection) {
                    console.log("Invalid user: not friends");
                    return; // Stop here
                }

                const roomId = [userId, targetUserId].sort().join("_");
                socket.join(roomId);
                console.log(`User ${userId} joined room ${roomId}`);
            } catch (err) {
                console.error("Error in join:", err);
            }
        });


        socket.on("sendMessage", async ({ userId, targetUserId, text }) => {
            try {
                const roomId = [userId, targetUserId].sort().join("_");

                let chat = await Chat.findOne({
                    participants: { $all: [userId, targetUserId] },
                });

                if (!chat) {
                    // ✅ Create new chat and save
                    chat = new Chat({
                        participants: [userId, targetUserId],
                        messages: [{ senderId: userId, text }],
                    });
                    await chat.save();
                } else {
                    // ✅ Add new message and save
                    chat.messages.push({ senderId: userId, text });
                    await chat.save();
                }

                // ✅ Emit to everyone in the room
                io.to(roomId).emit("messageReceived", { senderId: userId, text });

                console.log(`📨 Message sent to ${roomId}: ${text}`);
            } catch (error) {
                console.log("❌ Error sending message:", error);
            }
        });

        socket.on("disconnect", () => {
            console.log("❌ User disconnected:", socket.id);
        });
    });

    return io;
};

module.exports = initializeSocket;
