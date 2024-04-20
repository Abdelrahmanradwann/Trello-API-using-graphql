const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    Username: {
        type: String,
        required: true,
        trim: true
    },
    Email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    Password: {
        type: String,
        required: true,
        trim: true
    },
    token: {
        type: String,
        required: true
    },
    Profile_Pic: String,
    ResetPassword: String,
    ResetPwExpiryDate: Date,
    VerificationCode: String,
    ExpiryVCode: Date
})

module.exports = mongoose.model("User",UserSchema)