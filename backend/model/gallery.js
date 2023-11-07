const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gallerySchema = new Schema({
    text_1: {
        type: String,
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

module.exports = mongoose.model("Gallery", gallerySchema);