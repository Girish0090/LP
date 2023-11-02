const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    userName: {
        type: String,
    },
    Designation: {
        type: String,
    },
    Description: {
        type: String,
    },
    Rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    image: {
        filename: String,
        path: String
    },
    created: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model("Reviews", reviewSchema);