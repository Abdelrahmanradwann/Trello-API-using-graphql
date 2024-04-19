const mongoose = require('mongoose');

const WorkSpaceSchema = new mongoose.Schema({
    Users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    Boards: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board',
        index: true
    }],
    Title: {
        type: String,
        required: true,
        trim: true
    },
    Admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    Creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    inviteLink: String,
    LinkExpiryDate: Date
},
    {timestamps: true}
    
)

module.exports = mongoose.model('WorkSpaceSchema',WorkSpaceSchema)