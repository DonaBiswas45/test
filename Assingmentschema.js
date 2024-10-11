const mongoose = require('mongoose');
const assignmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
    },
    task: {
        type: String,
        required: true, 
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending', 
    },
    timestamp: {
        type: Date,
        default: Date.now, 
    },
});

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;
