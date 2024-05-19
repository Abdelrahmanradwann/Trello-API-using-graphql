const mongoose = require('mongoose');

const ListSchema = new mongoose.Schema({
    Title: {
        type: String,
        required: true
    },
    Transition: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'List',
        required: true
    }],
    Creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    Tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
    }],
    AllowedRoles: [{
        type: String
    }]
},
    {timestamps: true}
    
)

module.exports = mongoose.model('List',ListSchema)