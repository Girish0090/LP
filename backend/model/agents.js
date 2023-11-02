const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const agentSchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    mobile: {
        type: Number
    },
    age: {
        type: Number
    },
    address: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    experience: {
        type: Number
    },
    description: {
        type: String
    },
    image:
    {
        filename: String,
        path: String
    },
    runningProject: {
        type: Number
    },
    completedProject: {
        type: Number
    },
    category: {
        type: String,
        enum: ['Architects', 'VastuExpert'],
    },
});

module.exports = mongoose.model('Agent', agentSchema);
// age, running project, complete project