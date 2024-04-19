const mongoose = require('mongoose');

const BoardSchema = new mongoose.Schema({
    Users: {
        type: Map,  // name
        of: String  // role
    },
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