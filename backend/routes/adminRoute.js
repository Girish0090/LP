const router = require('express').Router();
const multer = require('multer');
const adminController = require('../controllers/adminController');
const checkAuth = require('../middleware/checkAuth');
const path = require('path');


// For Banner Offer Image
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/bannerImage');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });


// For Property Image
const storageForUploadImage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/propertyImage');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const propertyImage = multer({ storage: storageForUploadImage });


// For Reviews Image
const ImagesReview = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/reviewsImage');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const ReviewImage = multer({ storage: ImagesReview });


// For Admin Image
const AdminImages = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/adminImage');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const AdminImage = multer({ storage: AdminImages });


// For Agents Image
const AgentsImages = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/agentsImage');
    },
    filename: function (req, file, cb) {
        const username = req.body.userName; // Replace with how you obtain the username
        const date = new Date().toISOString().replace(/[-:]/g, ''); // Format date as "yyyyMMddTHHmmss"
        const extname = path.extname(file.originalname);
        const uniqueFileName = username + '-' + date + extname;
        console.log(uniqueFileName);
        cb(null, uniqueFileName);
    }
});
const AgentImage = multer({ storage: AgentsImages });


// For Upload Brochure
// const Brochure = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/brochure');
//     },
//     filename: function (req, file, cb) {
//         const username = req.body.project_Id; // Replace with how you obtain the username
//         const date = new Date().toISOString().replace(/[-:]/g, ''); // Format date as "yyyyMMddTHHmmss"
//         const extname = path.extname(file.originalname);
//         const uniqueFileName = username + '-' + date + extname;
//         cb(null, uniqueFileName);
//     }
// });
// const uploadBrochure = multer({ storage: Brochure });




// --------------------------------Register/Login/Logout ---------------------------
// Register Admin Api
router.post('/register',AdminImage.single('image'), adminController.registerAdmin);
// Login Admin Api
router.post('/login', adminController.loginAdmin);


// Render - Login Page
router.get('/', adminController.getAdminLogin);
router.get('/login', adminController.getAdminLogin);

// LogOut APi
router.get('/logout', adminController.logOutApi);


// --------------------------------Dashboard ---------------------------
// Render Dashboard Page
router.get('/dashboard', checkAuth, adminController.getAdminDashboard);


// --------------------------------Slider ---------------------------
// Render Banner - Add Page
router.get('/bannerPage',checkAuth, adminController.getBannerPage);

// Render Banner - View List Page
router.get('/bannerPageView',checkAuth, adminController.getBannerPageView);

// Add Banner Api
router.post('/BannerApi',checkAuth, upload.single('image'), adminController.uploadBanners);

// Delete Banner Api
router.get('/deleteBanner/:bannerId',checkAuth, adminController.deleteBanners);


// --------------------------------Projects ---------------------------
// Render Property - Add page
router.get('/addProperty',checkAuth, adminController.addProperty);

// Render Property - View page
router.get('/propertyView',checkAuth, adminController.propertyView);

// Add Property Api
router.post('/postProperty', propertyImage.array('image', 4), adminController.postProperty);

// Edit Property Api
router.post('/editProperty/:propertyId',checkAuth, adminController.editProperty);

// Delete Property Api
router.get('/deleteProperty/:propertyId',checkAuth, adminController.deleteProperty);


// --------------------------------Reviews ---------------------------
// Render Review - Add page
router.get('/review',checkAuth, adminController.postReview);

// Render Review - View page
router.get('/reviewPageView',checkAuth, adminController.getReviewPageView);

// Add Review Api
router.post('/addReview',checkAuth, ReviewImage.single('image'), adminController.addReview);

// Edit Reviews Api
router.post('/editReview/:reviewId',checkAuth, adminController.editReview);

// Delete Reviews Api
router.get('/deleteReview/:reviewId',checkAuth, adminController.deleteReview);


// --------------------------------Contact ---------------------------
// Render Contact - View page
router.get('/contactInfo',checkAuth, adminController.getContact);

// Delete Contact Api
router.get('/deleteContact/:contactId',checkAuth, adminController.deleteContact);


// --------------------------------Enquiries ---------------------------
// Render Enquiry - View page
router.get('/enquiries',checkAuth, adminController.getEnquiry);


// --------------------------------Project Contact ---------------------------
// Render Project Contact - View page
router.get('/projectContact',checkAuth, adminController.projectContact);


// --------------------------------Agent ---------------------------
// Render Agents - Add page
router.get('/addAgents',checkAuth, adminController.addAgents);

// Render Agents - View page
router.get('/viewAgents',checkAuth, adminController.viewAgents);

// Add Agent Api
router.post('/agentAdd',checkAuth, AgentImage.single('image'), adminController.agentAdd);

// Delete Agent Api
router.get('/agentDelete/:agentId',checkAuth, adminController.agentDelete);



module.exports = router;