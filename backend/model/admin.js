const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    email: { type: String, unique: true, lowercase: true },
    userName: { type: String },
    mobile: { type: Number },
    password: { type: String },
    image: {
        filename: String,
        path: String
    },
    created: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Admin', adminSchema);
