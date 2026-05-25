const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log("Revised Auth Header", authHeader);

    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();

    } catch (e) {
        console.error("JWT Error:", e.message);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = authMiddleware;