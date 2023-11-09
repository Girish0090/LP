const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const Banner = require('../model/banner');
const Contact = require('../model/contactForm');
const Property = require('../model/property');
const Review = require('../model/reviews');
const Admin = require('../model/admin');
const Career = require('../model/career');
const projectContact = require('../model/projectContact');
const Agents = require('../model/agents');
const Gallery = require('../model/gallery');

const path = require('path');
const fs = require('fs');



// --------------------------------Register/Login/Logout ---------------------------
// Register Admin Api
exports.registerAdmin = async (req, res) => {
    try {

        const { originalname, path } = req.file;
        const { email, userName, mobile, password } = req.body;

        const existingUser = await Admin.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }

        bcrypt.hash(password, 10, async (err, hash) => {
            if (err) {
                return req.json({ success: false, message: "Hash Error!" })
            } else {
                const user = new Admin({
                    email,
                    userName,
                    mobile,
                    password: hash,
                    image: {
                        filename: originalname, path
                    },
                })

                await user.save()

                // res.redirect('/admin/login');
                res.status(201).json({ success: true, message: 'Admin registered successfully' });
            }
        })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Registration failed', data: err.message });
    }
}

// Login Admin Api
exports.loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Admin.findOne({ email });

        if (!user) {
            const errorMessage = 'Invalid email or password';
            return res.redirect(`/admin/login?error=${errorMessage}`);
            // return res.status(400).json({ success: false, message: errorMessage });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            const errorMessage = 'Password does not match!';
            return res.redirect(`/admin/login?error=${errorMessage}`);
            // return res.status(400).json({ success: false, message: errorMessage });
        }

        const payload = { userId: user._id }
        const token = jwt.sign(payload, process.env.JwtKey);

        res.cookie('token', token, { httpOnly: true, maxAge: 86400000 });
        res.redirect('/admin/dashboard');
        // return res.json({ success: true, token: token, message: 'Login Successfull !', data: user })

    } catch (error) {
        res.status(500).json({ success: false, message: 'Error Occured..', data: error.message });
    }
}

// Render Dashboard Page
exports.getAdminLogin = async (req, res) => {
    try {
        const pageTitle = 'Admin Login -';
        const errorMessage = req.query.error || '';

        if (req.userData != undefined) {
            const userId = req.userData.userId;
            const user = await Admin.findById(userId);

            return res.render('login', { title: pageTitle, userName: user.userName, userImage: user.image.path, errorMessage });
        } else {
            return res.render('login', { title: pageTitle, userName: "", userImage: "", errorMessage });
        }

    } catch (error) {
        res.status(500).json({ success: false, message: 'Error occurred', error: error.message });
    }
}

// LogOut
exports.logOutApi = async (req, res) => {
    try {
        res.clearCookie('token');
        res.redirect('/admin/login');

    } catch (error) {
        res.status(500).json({ success: false, message: 'Error occurred', error: error.message });
    }
}


// --------------------------------Dashboard ---------------------------
// Render Dashboard Page
exports.getAdminDashboard = async (req, res) => {
    try {
        const pageTitle = 'Admin Dashboard -';

        const userId = req.userData.userId;
        const user = await Admin.findById(userId);

        Property.find({}).then((property) => {
            const filteredResidentialData = property.filter(item => item.category === 'Residential');
            const filteredCommercialData = property.filter(item => item.category === 'Commercial');
            const filteredIndustrialData = property.filter(item => item.category === 'Industrial');
            const filteredVillaData = property.filter(item => item.category === 'Villa');

            return res.render('dashboard', { title: pageTitle, userName: user.userName, userImage: user.image.path, propertyLength: property.length, residentialLength: filteredResidentialData.length, commercialLength: filteredCommercialData.length, industrialLength: filteredIndustrialData.length, villaLength: filteredVillaData.length });
        }).catch((err) => {
            console.error('Error fetching banners:', err);
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error occurred', error: error.message });
    }
}


// --------------------------------Slider ---------------------------
// Render Banner - Add Page
exports.getBannerPage = async (req, res) => {
    try {
        const pageTitle = 'Admin Banner Offer Add -';

        const userId = req.userData.userId;
        const user = await Admin.findById(userId);

        res.render('bannerPage', { title: pageTitle, userName: user.userName, userImage: user.image.path });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error occurred', error: error.message });
    }
}

// Render Banner - View List Page
exports.getBannerPageView = async (req, res) => {
    try {
        const pageTitle = 'Admin Banner Offer View -';

        const userId = req.userData.userId;
        const user = await Admin.findById(userId);

        Banner.find({}).then((banners) => {
            return res.render('bannerPageView', { title: pageTitle, userName: user.userName, userImage: user.image.path, bannerData: banners });
        }).catch((err) => {
            console.error('Error fetching banners:', err);
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error occurred', error: error.message });
    }
}

// Add Banner Api
exports.uploadBanners = async (req, res) => {
    try {
        const { originalname, path } = req.file;
        const { text_1, text_2 } = req.body;

        if (!text_1 || !text_2) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        let banner = new Banner({
            text_1: text_1,
            text_2: text_2,
            image: {
                filename: originalname, path
            },
        });
        banner.save().then((banner, err) => {
            if (banner) {
                // res.redirect('/admin/bannerPageView');
                res.status(200).send({ success: true, message: 'Slider Uploaded!', banner });
            } else {
                // return res.redirect(`/admin/bannerPageView?error=${err}`);
                res.status(400).send({ success: false, message: 'Error!', err });
            }
        }).catch(err => {
            res.status(400).send({ success: false, message: 'Internal Error!', err });
        })

    } catch (error) {
        res.status(500).json({ success: false, message: 'Error occurred', error: error.message });
    }
}

// Delete Banner Api
exports.deleteBanners = async (req, res) => {
    try {
        const { bannerId } = req.params;

        // Find and delete the product by ID
        const deletedProduct = await Banner.findByIdAndDelete(bannerId);

        if (!deletedProduct) {
            return res.status(404).json({ success: false, message: 'Slider not found' });
        } else {

            const imagePath = path.join(__dirname, '..', 'uploads/bannerImage', deletedProduct.image.filename);
            if (fs.existsSync(imagePath)) {
                fs.unlink(imagePath, (err) => {
                    if (err) {
                        return res.status(500).send({ success: false, message: 'Error deleting Slider.', err });
                    } else {
                        res.status(200).send({ success: true, message: 'Slider Deleted Successfully!' });
                    }
                });
            }

        }

    } catch (error) {
        res.status(500).json({ success: false, message: 'Error occurred', error: error.message });
    }
}


// --------------------------------Projects ---------------------------
// Render Property - Add page
exports.addProperty = async (req, res) => {
    try {
        const pageTitle = 'Admin Post Property -';

        const userId = req.userData.userId;
        const user = await Admin.findById(userId);

        res.render('addProperty', { title: pageTitle, userName: user.userName, userImage: user.image.path });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error occurred', error: error.message });
    }
}

// Render Property - View page
exports.propertyView = async (req, res) => {
    try {
        const pageTitle = 'Admin Property View -';

        const userId = req.userData.userId;
        const user = await Admin.findById(userId);

        Property.find({}).then((property) => {
            return res.render('propertyView', { title: pageTitle, userName: user.userName, userImage: user.image.path, propertyData: property });
        }).catch((err) => {
            console.error('Error fetching banners:', err);
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error occurred', error: error.message });
    }
}

// Add Property Api
exports.postProperty = async (req, res) => {
    try {
        const { project_Id, project_name, project_description, project_price, area, city, state, category, status } = req.body;

        if (!project_Id || !project_name || !project_description || !project_price || !area || !city || !state || !category || !status) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        if (!req.files || !req.files.image || !req.files.brochure) {
            return res.status(400).send({ success: false, message: 'Please provide both images and a brochure.' });
        }

        const existingProperty = await Property.findOne({ project_Id });

        if (existingProperty) {
            res.status(400).send({ success: false, message: 'Existing Property ID!' });
        } else {

            const propertyImages = req.files.image;
            const brochure = req.files.brochure;

            let imagesData = propertyImages.map(file => ({
                filename: file.originalname,
                path: file.path,
            }));

            let property = new Property({
                project_Id,
                project_name,
                project_description,
                project_price,
                area,
                city,
                state,
                category,
                status,
                image: imagesData,
                brochure: {
                    filename: brochure[0].filename, path: brochure[0].path
                }
            });

            property.save().then((property, err) => {
                if (property) {
                    // res.redirect('/admin/propertyView');
                    res.status(200).send({ success: true, message: 'Property Uploaded!', property });
                } else {
                    // return res.redirect(`/admin/bannerPageView?error=${err}`);
                    res.status(400).send({ success: false, message: 'Error!', err });
                }
            }).catch(err => {
                res.status(400).send({ success: false, message: 'Internal Error!', err });
            })
        }




    } catch (error) {
        res.status(500).json({ success: false, message: 'Error occurred', error: error.message });
    }
}

// Edit Property Api
exports.editProperty = async (req, res) => {
    try {
        const { propertyId } = req.params;

        const { project_name, project_description, project_price, city, state, status, category, area } = req.body;

        const updateFields = {
            project_name,
            project_description,
            project_price,
            city,
            state,
            status,
            category,
            area
        }

        const product = await Property.findOneAndUpdate({ project_Id: propertyId }, updateFields, { new: true });

        if (!product) {
            return res.status(404).send('Project not found');
        } else {
            // res.redirect(`/admin/propertyView`);
            res.status(200).send({ success: true, message: 'Property Edit Successfully!' });
        }

    } catch (error) {
        res.status(500).json({ success: false, message: 'Error occurred', error: error.message });
    }
}

// Delete Property Api
exports.deleteProperty = async (req, res) => {
    try {
        const { propertyId } = req.params;

        // Find and delete the product by ID
        const deletedProduct = await Property.findByIdAndDelete(propertyId);

        if (!deletedProduct) {
            return res.status(404).json({ success: false, message: 'Property not found' });
        } else {
            // Delete images
            const imagesToDelete = deletedProduct.image && Array.isArray(deletedProduct.image) ? deletedProduct.image : [];

            const imagePaths = imagesToDelete.map(imageObj => path.join(__dirname, '..', imageObj.path));

            const imageErrors = imagePaths
                .filter(filePath => fs.existsSync(filePath))
                .map(filePath => {
                    try {
                        fs.unlinkSync(filePath);
                        return null;
                    } catch (err) {
                        return `Error deleting image ${filePath}: ${err}`;
                    }
                })
                .filter(error => error !== null);

            // Delete brochure
            if (deletedProduct.brochure) {
                const brochurePath = path.join(__dirname, '..', deletedProduct.brochure.path);
                if (fs.existsSync(brochurePath)) {
                    try {
                        fs.unlinkSync(brochurePath);
                    } catch (err) {
                        console.error(`Error deleting brochure: ${err}`);
                    }
                }
            }

            const allErrors = [...imageErrors];
            const successMessage = allErrors.length === 0 ? 'Files deleted successfully' : 'Error deleting files';
            const statusCode = allErrors.length === 0 ? 200 : 500;

            res.status(statusCode).send({ success: allErrors.length === 0, message: successMessage });
        }


    } catch (error) {
        res.status(500).json({ success: false, message: 'Error occurred', error: error.message });
    }
}


// --------------------------------Reviews ---------------------------
// Render Review - Add page
exports.postReview = async (req, res) => {
    try {
        const pageTitle = 'Admin Add Review -';

        const userId = req.userData.userId;
        const user = await Admin.findById(userId);

        res.render('addReview', { title: pageTitle, userName: user.userName, userImage: user.image.path });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error occurred', error: error.message });
    }
}

// Render Review - View page
exports.getReviewPageView = async (req, res) => {
    try {
        const pageTitle = 'Admin Review Page View -';
        const userId = req.userData.userId;
        const user = await Admin.findById(userId);

        Review.find({}).then((review) => {
            return res.render('reviewPageView', { title: pageTitle, userName: user.userName, userImage: user.image.path, reviewData: review });
        }).catch((err) => {
            console.error('Error fetching banners:', err);
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error occurred', error: error.message });
    }
}

// Add Review Api
exports.addReview = async (req, res) => {
    try {
        const { originalname, path } = req.file;
        const { userName, Designation, Description, Rating } = req.body;


        if (!userName || !Designation || !Description || !Rating) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        if (Rating < 1 || Rating > 5) {
            return res.status(400).json({ success: false, message: 'Invalid Rating. Rating must be between 1 and 5.' });
        }

        const review = new Review({
            userName,
            Designation,
            Description,
            Rating,
            image: {
                filename: originalname, path
            },
        });

        const savedReview = await review.save();

        res.status(201).json({ success: true, message: 'Review added successfully', review: savedReview });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Error Occured..', data: error.message });
    }
}

// Edit Reviews Api
exports.editReview = async (req, res) => {
    try {
        const { reviewId } = req.params;

        const { userName, Designation, Description, Rating } = req.body;

        const updateFields = {
            userName,
            Designation,
            Description,
            Rating,
        }

        const review = await Review.findByIdAndUpdate(reviewId, updateFields, { new: true });

        if (!review) {
            return res.status(404).send('Reviews not found');
        } else {
            // res.redirect(`/admin/propertyView`);
            res.status(200).send({ success: true, message: 'Review Edit Successfully!' });
        }

    } catch (error) {
        res.status(500).json({ success: false, message: 'Error occurred', error: error.message });
    }
}

// Delete Reviews Api
exports.deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;

        const deletedReview = await Review.findByIdAndDelete(reviewId);

        if (!deletedReview) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        } else {
            const imagePath = path.join(__dirname, '..', 'uploads/reviewsImage', deletedReview.image.filename);
            if (fs.existsSync(imagePath)) {
                fs.unlink(imagePath, (err) => {
                    if (err) {
                        return res.status(500).send({ success: false, message: 'Error deleting Review.', err });
                    } else {
                        res.status(200).send({ success: true, message: 'Review Deleted Successfully!' });
                    }
                });
            }
        }

    } catch (error) {
        res.status(500).json({ success: false, message: 'Error occurred', error: error.message });
    }
}


// --------------------------------Contact ---------------------------
// Render Contact - View page
exports.getContact = async (req, res) => {
    try {
        const pageTitle = 'Admin Contact Details -';

        const userId = req.userData.userId;
        const user = await Admin.findById(userId);

        Contact.find({}).then((detail) => {
            return res.render('contactInfo', { title: pageTitle, userName: user.userName, userImage: user.image.path, contactData: detail });
        }).catch((err) => {
            console.error('Error fetching banners:', err);
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error occurred', error: error.message });
    }
}

// Delete Contact Api
exports.deleteContact = async (req, res) => {
    try {
        const { contactId } = req.params;

        const deletedProduct = await Contact.findByIdAndDelete(contactId);

        if (!deletedProduct) {
            return res.status(404).json({ success: false, message: 'Contact Enquiry not found' });
        } else {
            res.redirect(`/admin/contactInfo`);
        }

    } catch (error) {
        res.status(500).json({ success: false, message: 'Error occurred', error: error.message });
    }
}


// --------------------------------Enquiry ---------------------------
// Render Enquiry Page
exports.getEnquiry = async (req, res) => {
    try {
        const pageTitle = 'Admin Enquiry Page -';

        const userId = req.userData.userId;
        const user = await Admin.findById(userId);

        Career.find({}).then((career) => {

            return res.render('enquiries', { title: pageTitle, userName: user.userName, userImage: user.image.path, enquiryData: career });
        }).catch((err) => {
            console.error('Error fetching banners:', err);
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error occurred', error: error.message });
    }
}

// Delete Enquiry Api
exports.deleteEnquiry = async (req, res) => {
    try {
        const { careerId } = req.params;

        const deletedCareer = await Career.findByIdAndDelete(careerId);

        if (!deletedCareer) {
            return res.status(404).json({ success: false, message: 'Career Enquiry not found' });
        } else {
            const resumePath = path.join(__dirname, '..', 'uploads/resumepdf', deletedCareer.resumePDF.filename);
            if (fs.existsSync(resumePath)) {
                fs.unlink(resumePath, (err) => {
                    if (err) {
                        return res.status(500).send({ success: false, message: 'Error deleting Enquiry.', err });
                    } else {
                        res.status(200).send({ success: true, message: 'Career Enquiry Deleted Successfully!' });
                    }
                });
            }
        }

    } catch (error) {
        res.status(500).json({ success: false, message: 'Error occurred', error: error.message });
    }
}


// --------------------------------Project Contact ---------------------------
// Render Project Contact Page
exports.projectContact = async (req, res) => {
    try {
        const pageTitle = 'Admin Enquiry Page -';

        const userId = req.userData.userId;
        const user = await Admin.findById(userId);

        projectContact.find({}).then((data) => {

            return res.render('projectContact', { title: pageTitle, userName: user.userName, userImage: user.image.path, contactData: data });
        }).catch((err) => {
            console.error('Error fetching banners:', err);
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error occurred', error: error.message });
    }
}

// Delete Contact Api
exports.deleteProjectContact = async (req, res) => {
    try {
        const { contactId } = req.params;

        const deletedProduct = await projectContact.findByIdAndDelete(contactId);

        if (!deletedProduct) {
            return res.status(404).json({ success: false, message: 'Contact Enquiry not found' });
        } else {
            res.status(200).send({ success: true, message: 'Agent Deleted Successfully!' });
        }

    } catch (error) {
        res.status(500).json({ success: false, message: 'Error occurred', error: error.message });
    }
}


// --------------------------------Agents ---------------------------
// Render Agents - Add Page
exports.addAgents = async (req, res) => {
    try {
        const pageTitle = 'Admin Agents Add -';

        const userId = req.userData.userId;
        const user = await Admin.findById(userId);

        res.render('addAgents', { title: pageTitle, userName: user.userName, userImage: user.image.path });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error occurred', error: error.message });
    }
}

// Render Agents - View page
exports.viewAgents = async (req, res) => {
    try {
        const pageTitle = 'Admin Agents Page View -';
        const userId = req.userData.userId;
        const user = await Admin.findById(userId);

        Agents.find({}).then((agents) => {
            return res.render('agentsPageView', { title: pageTitle, userName: user.userName, userImage: user.image.path, agentsData: agents });
        }).catch((err) => {
            console.error('Error fetching Agents:', err);
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error occurred', error: error.message });
    }
}

// Agent Add Api
exports.agentAdd = async (req, res) => {
    try {
        const { userName, email, mobile, age, address, experience, description, runningProject, completedProject, category, city, state, education, specialist } = req.body;
        const { filename, path } = req.file;


        if (!userName || !email || !mobile || !age || !address || !experience || !description || !runningProject || !completedProject || !category || !city || !state || !education || !specialist) {
            cleanupUpload(path);
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        const existingUser = await Agents.findOne({ email });

        if (existingUser) {
            cleanupUpload(path);
            res.status(400).send({ success: false, message: 'Already Existing Agents with this Email ID!' });
        } else {

            let agents = new Agents({
                userName,
                email,
                mobile,
                age,
                address,
                city,
                state,
                experience,
                description,
                runningProject,
                completedProject,
                category,
                education,
                specialist,
                image: {
                    filename: filename, path
                },
            });

            agents.save().then((agents, err) => {
                if (agents) {
                    // res.redirect('/admin/propertyView');
                    res.status(200).send({ success: true, message: 'Agent Details Uploaded!', agents });
                } else {
                    cleanupUpload(path);
                    // return res.redirect(`/admin/bannerPageView?error=${err}`);
                    res.status(400).send({ success: false, message: 'Error!', err });
                }
            }).catch(err => {
                cleanupUpload(path);
                res.status(400).send({ success: false, message: 'Internal Error!', err });
            })
        }




    } catch (error) {
        res.status(500).json({ success: false, message: 'Error occurred', error: error.message });
    }
}

// Agent Delete Api
exports.agentDelete = async (req, res) => {
    try {
        const { agentId } = req.params;

        // Find and delete the product by ID
        const deletedAgent = await Agents.findByIdAndDelete(agentId);

        if (!deletedAgent) {
            return res.status(404).json({ success: false, message: 'Agent not found' });
        } else {

            const imagePath = path.join(__dirname, '..', 'uploads/agentsImage', deletedAgent.image.filename);
            if (fs.existsSync(imagePath)) {
                fs.unlink(imagePath, (err) => {
                    if (err) {
                        return res.status(500).send({ success: false, message: 'Error deleting Slider.', err });
                    } else {
                        res.status(200).send({ success: true, message: 'Agent Deleted Successfully!' });
                    }
                });
            }

        }

    } catch (error) {
        res.status(500).json({ success: false, message: 'Error occurred', error: error.message });
    }
}

// Edit Agent Api
exports.editAgent = async (req, res) => {
    try {
        const { agentId } = req.params;

        const { userName, email, mobile, age, address, experience, description, runningProject, completedProject, category, city, state, education, specialist } = req.body;

        const updateFields = {
            userName,
            email,
            mobile,
            age,
            address,
            experience,
            experience,
            description,
            runningProject,
            completedProject,
            category,
            city,
            state,
            education,
            specialist,
        }

        const agent = await Agents.findByIdAndUpdate(agentId, updateFields, { new: true });

        if (!agent) {
            return res.status(404).send('Agent Details not found');
        } else {
            // res.redirect(`/admin/propertyView`);
            res.status(200).send({ success: true, message: 'Agent Details Edit Successfully!' });
        }

    } catch (error) {
        res.status(500).json({ success: false, message: 'Error occurred', error: error.message });
    }
}


// ---------------------------Gallery--------------
// Render Gallery - Add Page
exports.addGallery = async (req, res) => {
    try {
        const pageTitle = 'Admin Gallery Add -';

        const userId = req.userData.userId;
        const user = await Admin.findById(userId);

        res.render('addGallery', { title: pageTitle, userName: user.userName, userImage: user.image.path });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error occurred', error: error.message });
    }
}

// Render Gallery - View page
exports.viewGallery = async (req, res) => {
    try {
        const pageTitle = 'Admin Gallery Page View -';
        const userId = req.userData.userId;
        const user = await Admin.findById(userId);

        Gallery.find({}).then((gallery) => {
            return res.render('galleryView', { title: pageTitle, userName: user.userName, userImage: user.image.path, galleryData: gallery });
        }).catch((err) => {
            console.error('Error fetching Gallery:', err);
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error occurred', error: error.message });
    }
}

// Gallery Add Api
exports.galleryUpload = async (req, res) => {
    try {

        const { text_1 } = req.body;

        if (!text_1 || !req.file) {
            cleanupUpload(path);
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }
        const { filename, path } = req.file;

        let gallery = new Gallery({
            text_1,
            image: {
                filename: filename, path
            },
        });

        gallery.save().then((gallery, err) => {
            if (gallery) {
                // res.redirect('/admin/propertyView');
                res.status(200).send({ success: true, message: 'Gallery Image Uploaded!', gallery });
            } else {
                cleanupUpload(path);
                // return res.redirect(`/admin/bannerPageView?error=${err}`);
                res.status(400).send({ success: false, message: 'Error!', err });
            }
        }).catch(err => {
            cleanupUpload(path);
            res.status(400).send({ success: false, message: 'Internal Error!', err });
        })

    } catch (error) {
        cleanupUpload(path);
        console.log(error);
        res.status(500).json({ success: false, message: 'Error occurred', error: error.message });
    }
}

// Delete Banner Api
exports.deleteGallery = async (req, res) => {
    try {
        const { galleryId } = req.params;

        // Find and delete the product by ID
        const deletedGallery = await Gallery.findByIdAndDelete(galleryId);

        if (!deletedGallery) {
            return res.status(404).json({ success: false, message: 'Gallery not found' });
        } else {

            const imagePath = path.join(__dirname, '..', 'uploads/galleryImage', deletedGallery.image.filename);
            if (fs.existsSync(imagePath)) {
                fs.unlink(imagePath, (err) => {
                    if (err) {
                        return res.status(500).send({ success: false, message: 'Error deleting Gallery.', err });
                    } else {
                        res.status(200).send({ success: true, message: 'Gallery Image Deleted Successfully!' });
                    }
                });
            }

        }

    } catch (error) {
        res.status(500).json({ success: false, message: 'Error occurred', error: error.message });
    }
}





// -----------------Delete pdf/images function-------------------
// For Delete Image
function cleanupUpload(filePath) {
    return new Promise((resolve, reject) => {
        fs.unlink(filePath, (err) => {
            if (err) {
                reject(err); // Reject the promise in case of an error
            } else {
                resolve(); // Resolve the promise if the file is successfully deleted
            }
        });
    });
}
