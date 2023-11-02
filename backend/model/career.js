const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const carrerSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: true,
    },
    mobile: { 
        type: Number,
        required: true,
    },
    education_Level:{
        type:String,
        required: true,
    },
    additional_Msg:{
        type:String,
        required: true,
    },
    resumePDF: {
        filename: String,
        path: String
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Carrer', carrerSchema);