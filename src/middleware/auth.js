const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Adjust the path as necessary

const auth = async (req,res,next)=>{
    try {
        // verify the token
        const token = req.cookies?.token;
        
        if (!token) {
            return res.status(401).send("Invalid token");
        }
        
        // Decode the token to get the userId
        const decodedData = jwt.verify(token, 'randomSecret'); // Use the same secret as when the token was created
        const {userId} = decodedData;

        // Find the user by userId
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send("User not found");  
        }
        else {
            req.user = user; // Attach user to the request object            
            next(); // Call the next middleware or route handler
        }
    } catch (error) {
        console.error("Error fetching users1:", error);
        res.status(500).send(error.message);
    }
};

module.exports = auth;