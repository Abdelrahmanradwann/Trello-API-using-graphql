const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    Task: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        required: true,
        index: true
    }],
    Sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    Content: {
        type: String,
        required: true
    }
},
    
)

module.exports = mongoose.model('Comment',CommentSchema)