const mongoose = require('mongoose');
const validator = require('validator');

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
        max: 120
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
        default: ["no skills"],
        validate(value) {
            if (value.length < 4) {
                throw new Error('Skills array must contain at least one skill');
            }   
        }
    },
},{
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
