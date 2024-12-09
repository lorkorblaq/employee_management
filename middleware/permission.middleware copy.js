import { pool } from '../database/connect.js';

/**
 * Middleware to check if the user has required permissions
 * @param {Array} requiredPermissions - List of permissions required for the action
 */
export const checkPermissions = (requiredPermissions) => {
    return async (req, res, next) => {
        const userRole = req.user.role_id; // Extracted from JWT token (user role ID)
        console.log(userRole);
        const client = await pool.connect();
        try {
            // Fetch the role's permissions from the database
            const query = `SELECT permissions FROM roles WHERE id = $1`;
            const result = await client.query(query, [userRole]);
            console.log(result.rows);
            if (result.rows.length === 0) {
                return res.status(403).json({ message: "Forbidden" });
            }

            const rolePermissions = result.rows[0].permissions; // Permissions from DB

            // Check if the user's role has the required permissions
            const hasPermission = requiredPermissions.every(permission =>
                rolePermissions.includes(permission)
            );

            if (!hasPermission) {
                return res.status(403).json({ message: "Forbidden" });
            }

            next();
        } catch (err) {
            console.error("Error checking permissions:", err.message);
            return res.status(500).json({ message: "Internal Server Error" });
        } finally {
            client.release();
        }
    };
};
