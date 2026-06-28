import jwt from 'jsonwebtoken';

/**
 * Owner-specific auth middleware.
 * Only accepts tokens issued to owners (payload must contain role: 'owner').
 * Attaches req.ownerId for use in owner controllers.
 */
const ownerAuthMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Access denied: Token missing or invalid format' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Ensure the token belongs to an owner, not a player
        if (decoded.role !== 'owner') {
            return res.status(403).json({ success: false, message: 'Access denied: This endpoint is for owners only' });
        }

        req.ownerId = decoded.ownerId;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Access denied: Invalid or expired token' });
    }
};

export default ownerAuthMiddleware;
