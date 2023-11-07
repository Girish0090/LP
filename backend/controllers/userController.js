const Banner = require('../model/banner');
const Contact = require('../model/contactForm');
const Property = require('../model/property');
const Review = require('../model/reviews');
const Career = require('../model/career');
const projectContact = require('../model/projectContact');
const Agents = require('../model/agents');
const Gallery = require('../model/gallery');
const fs = require('fs');


// Get Banner Offer
exports.getBanner = async (req, res) => {
    try {

        Banner.find({}).then((banners) => {
            if (banners.length == 0) {
                return res.status(404).json({ success: false, message: 'No Banners Found!', data: banners, length: banners.length });
            } else {
                return res.status(200).json({ success: true, message: 'Banner Data retrieved successfully!', data: banners, length: banners.length });
            }
        }).catch((err) => {
            return res.status(500).json({ success: false, message: 'Error Occured in getting data!', error: err })
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Error Occured..', data: error.message });
    }
}

// Post Contact Details
exports.postContact = async (req, res) => {
    try {

        const { name, email, subject, message } = req.body;

        const contactData = await Contact.findOne({ email });

        if (!contactData) {
            const contact = new Contact({
                name,
                email,
                subject,
                message
            });

            const contactDetail = await contact.save();
            res.status(201).json({ success: true, message: 'Contact Submitted Sent successfully' });

        } else {
            res.status(400).json({ success: false, message: 'Email already registered!' });
        }

    } catch (error) {
        res.status(500).json({ success: false, message: 'Error Occured..', data: error.message });
    }
}

// Get Banner Offer
exports.getAllProperty = async (req, res) => {
    try {

        Property.find({}).then((property) => {
            if (property.length == 0) {
                return res.json({ success: true, message: 'No Projects Found!', data: property, length: property.length });
            } else {
                return res.json({ success: true, message: 'Projects Data retrieved successfully!', data: property, length: property.length });
            }
        }).catch((err) => {
            return res.status(500).json({ success: false, message: 'Error Occured in getting data!', error: err })
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Error Occured..', data: error.message });
    }
}

// Get Property by Category
exports.getPropByCat = async (req, res) => {
    try {
        const categoryName = req.params.category;
        const categoryData = await Property.find({ category: categoryName });

        if (categoryData.length > 0) {
            return res.json({ success: true, message: 'Projects Found By category!', data: categoryData, length: categoryData.length })
        } else {
            return res.json({ success: true, message: 'No Projects Found!', data: categoryData, length: categoryData.length })
        }

    } catch (error) {
        res.status(500).json({ success: false, message: 'Error Occured..', data: error.message });
    }
}

// Get Property by City
exports.getPropByCity = async (req, res) => {
    try {
        const cityName = req.params.city;
        const cityData = await Property.find({ city: cityName });

        if (cityData.length > 0) {
            return res.json({ success: true, message: 'Projects Found By category!', data: cityData, length: cityData.length })
        } else {
            return res.json({ success: true, message: 'No Projects Found!', data: cityData, length: cityData.length })
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error Occured..', data: error.message });
    }
}

// Get Single Property By Id
exports.getPropByID = async (req, res) => {
    try {
        const productId = req.params.Id;
        const product = await Property.find({ _id: productId });

        if (product.length > 0) {

            return res.json({ success: true, message: 'Project Detail get Successfully!', data: product });
        } else {
            return res.json({ success: false, message: 'No Project Found!' });
        }

    } catch (error) {
        res.status(500).json({ success: false, message: 'Error Occured..', data: error.message });
    }
}

// Get All Reviews
exports.getReviews = async (req, res) => {
    try {

        Review.find({}).then((review) => {
            if (review.length == 0) {
                return res.status(404).json({ success: true, message: 'No Reviews Found!', data: review, length: review.length })
            } else {
                return res.status(200).json({ success: true, message: 'Reviews Data get Successfully !', data: review, length: review.length })
            }
        }).catch((err) => {
            return res.json({ success: false, message: 'Error Occured in getting data!', error: err })
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Error Occured..', data: error.message });
    }
}

// Post Contact Details
exports.postJoinUs = async (req, res) => {
    try {

        const { name, email, mobile, education_Level, additional_Msg } = req.body;
        const { filename, path } = req.file;

        // Iterate through the array and check for empty fields
        const requiredFields = ['name', 'email', 'mobile', 'education_Level'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                cleanupUpload(path);
                return res.status(400).json({ success: false, message: `${field} is required.` });
            }
        }

        let career = new Career({
            name,
            email,
            mobile,
            education_Level,
            additional_Msg,
            resumePDF: {
                filename: filename, path
            },
        });
        career.save().then((career, err) => {
            if (career) {
                res.status(200).send({ success: true, message: 'Resume Submitted Successfully!', data: career });
            } else {
                cleanupUpload(path);
                res.status(400).send({ success: false, message: 'Error!', err });
            }
        }).catch(err => {
            if (err.code === 11000) {
                cleanupUpload(path);
                res.status(400).json({ success: false, message: 'Email is already registered.' });
            } else {
                cleanupUpload(path);
                res.status(400).json({ success: false, message: 'Internal Error!', err });
            }
        })

    } catch (error) {
        cleanupUpload(path);
        res.status(500).json({ success: false, message: 'Error Occured..', data: error.message });
    }
}


// Get Projects by Filter
exports.getPorpByFilter = async (req, res) => {
    try {

        const { categoryName } = req.query;
        const { status } = req.query;
        const { minPrice } = req.query;
        const { maxPrice } = req.query;


        if (!categoryName && !status && !minPrice && !maxPrice) {
            return res.status(400).json({ error: 'Query parameter is required.' });
        }

        Property.find({}).then((property) => {
            if (property.length == 0) {
                return res.json({ success: true, message: 'No Projects Found!', data: property, length: property.length });
            } else {

                if (categoryName) {
                    const filteredItems = property.filter(item => item.category === categoryName);
                    if (filteredItems.length > 0) {
                        return res.json({ success: true, message: 'Projects Data according to Category retrieved successfully!', data: filteredItems, length: filteredItems.length });
                    } else {
                        return res.json({ success: true, message: 'No Projects Found!', data: filteredItems });
                    }
                } else if (status) {
                    const filteredItems = property.filter(item => item.status === status);
                    if (filteredItems.length > 0) {
                        return res.json({ success: true, message: 'Projects Data according to Status retrieved successfully!', data: filteredItems, length: filteredItems.length });
                    } else {
                        return res.json({ success: true, message: 'No Projects Found!', data: filteredItems });
                    }
                } else if (minPrice && maxPrice) {

                    const parsedMinPrice = parseFloat(minPrice);
                    const parsedMaxPrice = parseFloat(maxPrice);

                    if (isNaN(parsedMinPrice) || isNaN(parsedMaxPrice)) {
                        return res.status(400).json({ error: 'minPrice and maxPrice must be valid numbers.' });
                    }

                    const filteredItems = property.filter(item => item.project_price >= parsedMinPrice && item.project_price <= parsedMaxPrice);

                    if (filteredItems.length > 0) {
                        return res.json({ success: true, message: 'Projects Data according to Price Range retrieved successfully!', data: filteredItems, length: filteredItems.length });
                    } else {
                        return res.json({ success: true, message: 'No Projects Found!', data: filteredItems });
                    }
                }




            }
        }).catch((err) => {
            return res.status(500).json({ success: false, message: 'Error Occured in getting data!', error: err })
        });



    } catch (error) {
        res.status(500).json({ success: false, message: 'Error Occured..', data: error.message });
    }
}

// Get Projects by Filter
exports.getPorpBySorting = async (req, res) => {
    try {

        const sortOrder = req.query.order;

        Property.find({}).then((property) => {
            if (property.length == 0) {
                return res.json({ success: true, message: 'No Projects Found!', data: property, length: property.length });
            } else {

                if (sortOrder === 'asc') {
                    const sortedData = property.slice().sort((a, b) => a.project_name.localeCompare(b.project_name));
                    return res.json({ success: true, message: 'Projects Data sorted in ascending order (A-Z).', data: sortedData, length: sortedData.length });

                } else if (sortOrder === 'desc') {
                    const sortedData = property.slice().sort((a, b) => b.project_name.localeCompare(a.project_name));
                    return res.json({ success: true, message: 'Projects Data sorted in descending order (Z-A).', data: sortedData, length: sortedData.length });

                } else {
                    res.status(400).json({ error: 'Invalid or missing sorting order. Use "asc" or "desc".' });
                }


            }
        }).catch((err) => {
            return res.status(500).json({ success: false, message: 'Error Occured in getting data!', error: err })
        });



    } catch (error) {
        res.status(500).json({ success: false, message: 'Error Occured..', data: error.message });
    }
}


// Post Contact Details
exports.projectContact = async (req, res) => {
    try {

        const { name, email, mobile, projectID } = req.body;

        const contact = new projectContact({
            name,
            email,
            mobile,
            projectID
        });

        const contactDetail = await contact.save();
        res.status(201).json({ success: true, message: 'Contact Details Submitted successfully' });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Error Occured..', data: error.message });
    }
}


// Get Agents List Api
exports.getAgents = async (req, res) => {
    try {

        const agentsCat = req.params.category;
        const allAgents = await Agents.find({ category: agentsCat });

        if (allAgents.length > 0) {
            return res.json({ success: true, message: 'Agents Found By category!', data: allAgents, length: allAgents.length })
        } else {
            return res.json({ success: true, message: 'No Agents Found!', data: allAgents, length: allAgents.length })
        }

    } catch (error) {
        res.status(500).json({ success: false, message: 'Error Occured..', data: error.message });
    }
}

// Get Single Property By Id
exports.getAgentByID = async (req, res) => {
    try {
        const agentId = req.params.Id;
        const agent = await Agents.find({ _id: agentId });

        if (agent.length > 0) {

            return res.json({ success: true, message: 'Agent Detail get Successfully!', data: agent });
        } else {
            return res.json({ success: false, message: 'No Agent Found!' });
        }

    } catch (error) {
        res.status(500).json({ success: false, message: 'Error Occured..', data: error.message });
    }
}

// Get Gallery Images
exports.getGalleryImages = async (req, res) => {
    try {

        Gallery.find({}).then((gallery) => {
            return res.status(200).json({ success: true, message: 'Gallery Data retrieved successfully!', data: gallery, length: gallery.length });
        }).catch((err) => {
            return res.status(500).json({ success: false, message: 'Error Occured in getting data!', error: err })
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Error Occured..', data: error.message });
    }
}





// -----------------------Delete uploaded pdf/images------------------
// Delete function
function cleanupUpload(filePath) {
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Error deleting uploaded file:', err);
        }
    });
}