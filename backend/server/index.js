const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');

const userRoutes = require('../routes/userRoute');
const adminRoutes = require('../routes/adminRoute');

// for .env file
require('dotenv').config();

const mongoose = require('../connection/db');

const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'templates', 'views'));
// Serve static files from the "public" directory
app.use('/public', express.static(path.join(__dirname, "../public")));

// For getting image folder -- multer library
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use("/api", userRoutes);
app.use("/admin", adminRoutes);


app.listen(port, () => {
    console.log(`Server is started on ${port}`);
})