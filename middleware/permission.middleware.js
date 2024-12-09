import { pool } from '../database/connect.js';

/**
 * Middleware to check if the user has required permissions
 * @param {Array} requiredPermissions - List of permissions required for the action
 */
// export const checkPermissions = (requiredPermissions) => {
//     return async (req, res, next) => {
//         const { role_id: userRole, id: userId } = req.user; // user info from JWT (role_id and user_id)
//         const { id: employeeId } = req.params; // employee ID from URL params if applicable
//         const client = await pool.connect();
            
//         try {
//             // Fetch the role's permissions and department from the database
//             const roleQuery = `SELECT permissions, name FROM roles WHERE id = $1`;
//             const roleResult = await client.query(roleQuery, [userRole]);
            
//             if (roleResult.rows.length === 0) {
//                 return res.status(403).json({ message: "Forbidden: Role not found" });
//             }

//             const rolePermissions = roleResult.rows[0].permissions; // Permissions from DB
//             const roleName = roleResult.rows[0].name; // Role name (e.g., 'Manager', 'Employee')
            
//             // Fetch the user's department ID if they are an employee
//             let userDepartmentId = null;
//             if (roleName === 'Manager' || roleName === 'Employee') {
//                 const userQuery = `SELECT department_id FROM employees WHERE user_id = $1`;
//                 const userResult = await client.query(userQuery, [userId]);
//                 if (userResult.rows.length > 0) {
//                     userDepartmentId = userResult.rows[0].department_id;
//                 }
//             }

//             // Check if the user's role has the required permissions
//             const hasPermission = requiredPermissions.every(permission =>
//                 rolePermissions.includes(permission)
//             );

//             if (!hasPermission) {
//                 return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
//             }

//             // If the user is a manager, check if they're managing employees within their own department
//             if (roleName === 'Manager') {
//                 if (employeeId) {
//                     // Check if manager is trying to manage an employee in the same department
//                     const employeeQuery = `SELECT department_id FROM employees WHERE id = $1`;
//                     const employeeResult = await client.query(employeeQuery, [employeeId]);

//                     if (employeeResult.rows.length === 0) {
//                         return res.status(404).json({ message: "Employee not found" });
//                     }

//                     const employeeDepartmentId = employeeResult.rows[0].department_id;
//                     if (employeeDepartmentId !== userDepartmentId) {
//                         return res.status(403).json({
//                             message: "You can only manage employees in your department"
//                         });
//                     }
//                 }
//             }

//             // If the user is a regular employee, ensure they can only view their own information
//             if (roleName === 'Employee' && employeeId && parseInt(employeeId) !== userId) {
//                 return res.status(403).json({ message: "Employees can only view their own information" });
//             }

//             // If everything passes, allow the request to continue
//             next();
//         } catch (err) {
//             console.error("Error checking permissions:", err.message);
//             return res.status(500).json({ message: "Internal Server Error" });
//         } finally {
//             client.release();
//         }
//     };
// };


// export const checkPermissions = (requiredPermissions) => {
//     return async (req, res, next) => {
//         const { role_id: userRole, id: userId } = req.user; // User info from JWT (role_id and user_id)
//         const { id: employeeId } = req.params; // Employee ID from URL params if applicable
//         const client = await pool.connect();
//         console.log("employee id", req.params);

//         try {
//             // Fetch the role's permissions and department from the database
//             const roleQuery = `SELECT permissions, name FROM roles WHERE id = $1`;
//             const roleResult = await client.query(roleQuery, [userRole]);

//             if (roleResult.rows.length === 0) {
//                 return res.status(403).json({ message: "Forbidden: Role not found" });
//             }

//             const rolePermissions = roleResult.rows[0].permissions;
//             const roleName = roleResult.rows[0].name; // Role name (e.g., 'Manager', 'Employee')

//             // If the user is an employee, ensure they can only view their own information
//             if (roleName === 'Employee' && employeeId && parseInt(employeeId) !== userId) {
//                 return res.status(403).json({ message: "Employees can only manage their own information" });
//             }

//             // Allow the request to continue if everything passes
//             next();
//         } catch (err) {
//             console.error("Error checking permissions:", err.message);
//             return res.status(500).json({ message: "Internal Server Error" });
//         } finally {
//             client.release();
//         }
//     };
// };


export const checkPermissions = (requiredPermissions) => {
    return async (req, res, next) => {
        const { role_id: userRole, id: userId } = req.user; // User info from JWT (role_id and user_id)
        const { id: employeeId } = req.params; // Employee ID from URL params if applicable
        const client = await pool.connect();
        console.log("employee id", employeeId);

        try {
            // Fetch the role's permissions and name from the database
            const roleQuery = `SELECT permissions, name FROM roles WHERE id = $1`;
            const roleResult = await client.query(roleQuery, [userRole]);

            if (roleResult.rows.length === 0) {
                return res.status(403).json({ message: "Forbidden: Role not found" });
            }

            const rolePermissions = roleResult.rows[0].permissions;
            console.log("rolePermissions", rolePermissions);
            const roleName = roleResult.rows[0].name; // Role name (e.g., 'Manager', 'Employee')

            // Employees: Restrict to only GET methods and their own data
            if (roleName === "Employee") {
                if (req.method !== "GET") {
                    return res.status(403).json({ message: "Employees can only view their own information." });
                }
                if (employeeId && parseInt(employeeId) !== userId) {
                    return res.status(403).json({ message: "You are only authorized to view your own information." });
                }
            }
            console.log("requiredPermissions", requiredPermissions);
            // For other roles, validate required permissions (if any)
            if (requiredPermissions && !requiredPermissions.every(permission => rolePermissions.includes(permission))) {
                return res.status(403).json({ message: "You do not have the required permissions." });
            }            

            // Allow the request to continue if everything passes
            next();
        } catch (err) {
            console.error("Error checking permissions:", err.message);
            return res.status(500).json({ message: "Internal Server Error" });
        } finally {
            client.release();
        }
    };
};
