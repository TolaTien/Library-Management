const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const createToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, {expiresIn: '1d' })
};

const createRefreshToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, {expiresIn: '7d' })
};

const verifyToken = (token) => {
    try{
        return jwt.verify(token, JWT_SECRET);
    }catch(err){
        throw new Error("Token không hợp lệ hoặc hết hạn");
    }
};

module.exports = {
    createToken,
    createRefreshToken,
    verifyToken
};