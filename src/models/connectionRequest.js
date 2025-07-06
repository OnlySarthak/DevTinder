const mongoose = require('mongoose');

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
            values : ['intrested','ignores','accepted','rejected'],
            message : '{value} is not allowed'
        }
    }
},{
    timestamps: true
});

connectionSchema.index({fromUserId : 1, toUserId : 1})

connectionSchema.pre("save", function(next) {
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("cannot sent request yourself");
    }
    next();
})

module.exports = mongoose.model('connectionSchema', connectionSchema);
