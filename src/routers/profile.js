const express = require('express');
const auth = require('../middleware/auth');

const profileRouter = express.Router();

profileRouter.post('/profile',auth , (req, res) => {
    res.send(req.user);
});

module.exports = profileRouter;