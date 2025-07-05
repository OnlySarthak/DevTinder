const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        maxlength: 10
    },
    lastName: {
        type: String,
        maxlength: 10
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email format');
            }
        }
    },
    password: {
        type: String
    },
    age: {
        type: Number,
        min: 0,
        max: 120,
        required: true,
    },
    gender: {
        type: String ,
        required: true,
        validate(value) {
            if(['male','female','other'].indexOf(value) === -1) {
                throw new Error('Invalid gender value');
            }
        }
    },
    photourl: {
        type: String,
        default: 'https://example.com/default-profile.png',
        
    },
    about: {
        type: String,
        default: "This is a default about section.",
        maxlength: 500
    },
    skills: {
        type: [String],
        default: ["no skills"]
    },
},{
    timestamps: true
});

userSchema.methods.generateAuthToken = function() {
    const user = this;
    const token = jwt.sign({ userId: user._id }, 'randomSecret', {
        expiresIn: '1h' // Token expiration time
    });
    return token;
};

userSchema.methods.verifyPassword = async function(password) {
    const user = this;
    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch;
};

module.exports = mongoose.model('User', userSchema);
