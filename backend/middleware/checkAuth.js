const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        
        if (req.cookies.token) {
            const token = req.cookies.token;
            const decode = jwt.verify(token, process.env.JwtKey)
            req.userData = decode
       
            next();
        }else if(!req.cookies.token) {
            return res.redirect('/admin/login');
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Auth Failed!', error: error })
    }
}