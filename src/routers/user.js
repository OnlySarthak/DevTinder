const express = require('express');
const auth = require('../middleware/auth');
const connectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

const userRouter = express.Router();

const USER_SAFE_DATA = 'firstName lastName gender about skills photourl age';

//get pending data about people'ss intrested connection to me 
userRouter.get('/user/request/received', auth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const intrestedRequestList = await connectionRequest.find({
      toUserId: loggedInUser._id,
      status: "intrested"
    }).populate("fromUserId", 'firstName lastName')
      .populate("fromUserId", USER_SAFE_DATA);

    if (intrestedRequestList.length == 0) {
      return res.send("you are not intrested for everyone");
    }

    const data = intrestedRequestList.map((row) => {
        return {
          data: row.fromUserId,
          _id: row._id
        }
    });

    res.send({
      message: "data fetched successfuly",
      data: data
    });
  } catch (error) {
    res.status(400).send("invalid request");
  }
});

//get data about accepted connections
userRouter.get('/user/connections', auth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const intrestedRequestList = await connectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" }
      ]
    }).populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    if (intrestedRequestList.length == 0) {
      return res.send("you have no acceptance");
    }

    const data = intrestedRequestList.map((row) => {
      if (loggedInUser._id.toString() === row.fromUserId._id.toString()) {
        return {
          data: row.toUserId,
          _id: row._id
        };
      }
      else {
        return {
          data: row.fromUserId,
          _id: row._id
        };
      }
    });

    res.send({
      message: "data fetched successfuly",
      data: data
    })
  } catch (error) {
    res.status(400).send("invalid request");
  }
});

userRouter.get("/feed", auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    // Cap the limit to max 50 per request
    limit = limit > 50 ? 50 : limit;

    const skip = (page - 1) * limit;

    const loggedInUser = req.user;

    // Step 1: Fetch all connection requests where current user is involved
    const connectionRequests = await connectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id },
        { toUserId: loggedInUser._id }
      ]
    }).select("fromUserId toUserId");

    // Step 2: Create a Set of user IDs to hide from feed
    const hideUsersFromFeed = new Set();
    connectionRequests.forEach(req => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    // Step 3: Query for users not in the hide list and not the current user
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } }
      ]
    }).select(USER_SAFE_DATA).skip(skip).limit(limit);

    // Step 4: Send feed
    res.send(users);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


module.exports = userRouter;