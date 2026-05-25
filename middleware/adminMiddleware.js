const adminMiddleware = (req, res, next) => {
    //authMiddleware should have already set req.user
    if (req.user && req.user.role === 'admin') {
        next(); // User is admin, proceed to the next middleware or route handler
    } else {
        return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
};

module.exports = adminMiddleware;