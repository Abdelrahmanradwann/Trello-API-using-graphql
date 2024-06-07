const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    Title: {
        type: String,
        required: true,
        trim: true
    },
    Deadline: {
        type: Date,
    },
    Cur_list: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'List',
        required: true
    },
    AssignedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    Description: String
 
},
    {
    timestamps: true
    }
)

module.exports = mongoose.model("Task",TaskSchema)