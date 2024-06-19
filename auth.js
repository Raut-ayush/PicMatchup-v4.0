const jwt = require('jsonwebtoken');
const config = require('../config');  // Assuming you have a config file for secrets

const auth = (req, res, next) => {
    // Get the token from the request header
    const token = req.headers['authorization'];
    
    // If no token, return 401 Unauthorized
    if (!token) {
        return res.status(401).json({ message: 'Authorization token required' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, config.JWT_SECRET);
        
        // Attach the user to the request object
        req.user = decoded;
        
        // Call the next middleware or route handler
        next();
    } catch (error) {
        // If token verification fails, return 401 Unauthorized
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = auth;
