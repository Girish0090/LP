const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const propertySchema = new Schema({
    project_Id:{
        type: String,
        unique:true
    },
    project_name: {
        type: String,
        unique:true
    },
    project_description: {
        type: String,
    },
    project_price: {
        type: Number,
    },
    area: {
        type: String,
        enum: ['sqft', 'sqyd', 'acre', 'hectare', 'gaj', 'bigha'],
    },
    image: [
        {
            filename: String,
            path: String
        }
    ],
    brochure:
        {
            filename: String,
            path: String
        },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    category: {
        type: String,
        enum: ['Residential', 'Commercial', 'Industrial', 'Villa'],
    },
    posted_Date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Sale', 'Sold'],
        default: 'Sale',
    },
});

module.exports = mongoose.model("Property", propertySchema);