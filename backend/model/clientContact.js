const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const clientSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        lowercase: true,
        required:true,
        unique:true
    },
    mobile: { type: Number, required:true, unique: true },
    subject: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    created: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model("ClientContact", clientSchema);