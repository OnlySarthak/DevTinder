const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const connectionSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    toUserId: {
        type: mongoose.SchemaTypes.ObjectId,
        required : true
    },
    status: {
        type: String,
        required: true,
        eva:{
            values : ['intrested','ignores'],
            message : '{value} is not allowed'
        }
    }
},{
    timestamps: true
});

module.exports = mongoose.model('connectionSchema', connectionSchema);
