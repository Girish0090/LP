const mongoose = require("mongoose");

mongoose.connect(process.env.DB_Name, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then( () => {
    console.log("Connection Successful");
}).catch( (e) => {
    console.log("No Connection");
})