const { Server } = require("socket.io"); // ✅ get the Server class

const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log("✅ User connected:", socket.id);

        // ✅ When client joins
        socket.on("join", ({ userId, targetUserId }) => {
            const roomId = [userId, targetUserId].sort().join("_");
            socket.join(roomId); // ✅ MUST JOIN ROOM
            console.log(`User ${userId} joined room ${roomId}`);
        });

        // ✅ When client sends message
        socket.on("sendMessage", ({ userId, targetUserId, text }) => {
            const roomId = [userId, targetUserId].sort().join("_");

            // ✅ Send to everyone in that room
            io.to(roomId).emit("messageReceived", {
                senderId: userId,
                text,
            });

            console.log(`📨 Message sent to ${roomId}: ${text}`);
        });

        socket.on("disconnect", () => {
            console.log("❌ User disconnected:", socket.id);
        });
    });

    return io;
};

module.exports = initializeSocket;
