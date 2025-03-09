const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = '10m';

const generateToken = (userId) => {
    return jwt.sign({userId}, JWT_SECRET, {expiresIn: JWT_EXPIRY});
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};

module.exports = {generateToken, verifyToken, JWT_EXPIRY};