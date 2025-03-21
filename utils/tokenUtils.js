const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateAccessToken = async (payload) => {
    return new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '2m', algorithm: 'HS256' },
            (err, token) => (err ? reject(err) : resolve(token))
        );
    });
};

const generateRefreshToken = async (payload) => {
    return new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '10h', algorithm: 'HS256' },
            (err, token) => (err ? reject(err) : resolve(token))
        );
    });
};

const verifyAccessToken = async (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) reject(err);
            else resolve(decoded);
        });
    });
};

const verifyRefreshToken = async (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
            if (err) reject(err);
            else resolve(decoded);
        });
    });
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
};
