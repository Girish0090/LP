const router = require('express').Router();
const userController = require('../controllers/userController');
const multer = require('multer');
const path = require('path');


// For Upload PDF
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/resumepdf');
    },
    filename: function (req, file, cb) {
        const username = req.body.name; // Replace with how you obtain the username
        const date = new Date().toISOString().replace(/[-:]/g, ''); // Format date as "yyyyMMddTHHmmss"
        const extname = path.extname(file.originalname);
        const uniqueFileName = username + '-' + date + extname;
        cb(null, uniqueFileName);
    }
});
const uploadPDF = multer({ storage: storage });



// Get All Banner Api
router.get('/getBanner', userController.getBanner); 

// Contact Form Api
router.post('/contactForm', userController.postContact);

// Get All Property Api
router.get('/getAllProperty', userController.getAllProperty);

// Get Property by category Api
router.get('/getPropertyByCat/:category', userController.getPropByCat);

// Get Property by City Name Api
router.get('/getPropertyByCity/:city', userController.getPropByCity);

// Get Single Property by Id Api
router.get('/getPropertyDetail/:Id', userController.getPropByID);

// Get All Reviews Api
router.get('/getAllReviews', userController.getReviews);

// Career Form Api
router.post('/joinUs',uploadPDF.single('resumePDF'), userController.postJoinUs);

// FIlter By CategoryName
router.get('/getFilterProperty', userController.getPorpByFilter);

// FIlter By CategoryName
router.get('/getSortProperty', userController.getPorpBySorting);

// Project Contact
router.post('/projectContact', userController.projectContact);


// Get Agent Api
router.get('/getAllAgents/:category', userController.getAgents);

// Get Single Agents by Id Api
router.get('/getAgentDetail/:Id', userController.getAgentByID);

module.exports = router;