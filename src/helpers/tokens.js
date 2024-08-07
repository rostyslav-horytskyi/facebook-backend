const jwt = require("jsonwebtoken");

exports.generateToken = (payload, expires) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: expires });
};
