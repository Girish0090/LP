const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectContactSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        lowercase: true,
        validate: {
            validator: function(v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: "Please enter a valid email"
        },
    },
    mobile: { 
        type: Number,
        required: true,
    },
    projectID:{
        type:String,
        required:true
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("projectContact", projectContactSchema);
