const {verifyToken} = require('../services/authService');

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({message: 'Authentication required'});
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);

    if (!payload) {
        return res.status(401).json({message: 'Token expired or invalid'});
    }
    next();
};

module.exports = {authenticate};