const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');

const adminAuth = async (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: 'Authorization token required' });
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (user && user.isAdmin) {  // Assuming you have an isAdmin field in the User model
            req.user = user;
            next();
        } else {
            return res.status(403).json({ message: 'Access denied' });
        }
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = adminAuth;
