import jwt from 'jsonwebtoken';

/**
 * Middleware function to authenticate requests using JWT token.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function in the stack.
 * @returns {void} Passes control to the next middleware if authentication is successful, otherwise sends a 401 error.
 */
function authMiddleware(req, res, next) {
    // Extract the token from the Authorization header (Bearer token format)
    const token = req.headers['authorization']?.split(' ')[1]; // Expecting the format: "Bearer <token>"

    // If no token is provided, return a 401 Unauthorized error
    if (!token) {
        return res.status(401).json({ error: "Authorization token missing" });
    }

    try {
        // Verify the token using the secret key, which is stored in environment variables
        // The decoded object will contain the payload (user info) embedded in the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the decoded user information (e.g., userId, email) to the request object
        // This data will be accessible in other routes or middleware
        req.user = { id: decoded.id, role_id: decoded.role_id, email: decoded.email };
        // Call the next middleware or route handler in the stack
        next();
    } catch (error) {
        // If token verification fails, return a 401 Unauthorized error
        return res.status(401).json({ error: "Invalid token" });
    }
}

// Export the middleware to use in other parts of the application
export default authMiddleware;
