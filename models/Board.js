const mongoose = require('mongoose');

const BoardSchema = new mongoose.Schema({
    Users: [
        { userId: String },
        { role: String}
    ],
    Lists: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'List',
        index: true
    }],
    Creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    Title: {
        type: String,
        required: true,
        trim: true
    },
    LinkExpiryDate: Date
})

module.exports = mongoose.model("Board",BoardSchema)