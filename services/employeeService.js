import { pool } from "../database/connect.js";
import { createUser } from "./authService.js";

/**
 * Creates a new employee and their associated user account.
 * @param {Object} employee - The employee details.
 * @param {string} employee.firstName - Employee's first name.
 * @param {string} employee.lastName - Employee's last name.
 * @param {string} employee.email - Employee's email.
 * @param {number} employee.roleId - ID of the role.
 * @param {number} employee.departmentId - ID of the department.
 * @param {string} employee.password - The plaintext password for the user account.
 * @returns {Object} The created employee and user data.
 */


export async function createEmployee({ first_name, last_name, email, role_id, department_id, password }) {
    const client = await pool.connect();
    try {
        await client.query("BEGIN"); // Start a transaction

        // Create the employee record first
        const query = `
            INSERT INTO employees (first_name, last_name, email, department_id)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const result = await client.query(query, [first_name, last_name, email, department_id]);

        // Create the user account only after employee record is successfully created
        const { user, token } = await createUser(email, role_id, password);

        // Link the created user to the employee by updating the user_id field in the employees table
        const updateQuery = `
            UPDATE employees
            SET user_id = $1
            WHERE id = $2
            RETURNING *;
        `;
        const updatedEmployee = await client.query(updateQuery, [user.id, result.rows[0].id]);

        await client.query("COMMIT"); // Commit the transaction
        return { employee: updatedEmployee.rows[0], user, token }; // Return both employee and user details
    } catch (error) {
        await client.query("ROLLBACK"); // Rollback transaction in case of error
        throw new Error("Error creating employee: " + error.message);
    } finally {
        client.release();
    }
}


/**
 * Retrieves an employee by ID.
 * @param {number} id - The employee ID.
 * @returns {Object} The employee data.
 */
export async function getEmployeeById(id) {
    const client = await pool.connect();
    try {
        const query = `
            SELECT 
                e.*, 
                u.role_id, 
                r.name AS role_name, 
                d.name AS department_name
            FROM employees e
            LEFT JOIN users u ON e.user_id = u.id
            LEFT JOIN roles r ON u.role_id = r.id
            LEFT JOIN departments d ON e.department_id = d.id
            WHERE e.user_id = $1;
        `;
        const result = await client.query(query, [id]);
        if (result.rows.length === 0) {
            throw new Error("Employee not found");
        }
        return result.rows[0];
    } catch (error) {
        throw new Error("Error retrieving employee: " + error.message);
    } finally {
        client.release();
    }
}



/**
 * Retrieves all employees.
 * @returns {Array} A list of all employees with role and department names.
 */
// export async function getAllEmployees() {
//     const client = await pool.connect();
//     try {
//         const query = `
//             SELECT 
//                 e.*, 
//                 u.role_id, 
//                 r.name AS role_name, 
//                 d.name AS department_name
//             FROM employees e
//             LEFT JOIN users u ON e.user_id = u.id
//             LEFT JOIN roles r ON u.role_id = r.id
//             LEFT JOIN departments d ON e.department_id = d.id;
//         `;
//         const result = await client.query(query);
//         return result.rows;
//     } catch (error) {
//         throw new Error("Error retrieving employees: " + error.message);
//     } finally {
//         client.release();
//     }
// }


export async function getAllEmployees(role, departmentId = null) {
    console.log("role:", role, "departmentId:", departmentId);
    const client = await pool.connect();
    try {
        let query = `
            SELECT e.*, u.role_id, r.name AS role_name, d.name AS department_name
            FROM employees e
            LEFT JOIN users u ON e.user_id = u.id
            LEFT JOIN roles r ON u.role_id = r.id
            LEFT JOIN departments d ON e.department_id = d.id
        `;

        // Add filtering for Managers
        if (role === "Manager" && departmentId) {
            query += ` WHERE e.department_id = $1`;
        } else if (role === "Manager" && !departmentId) {
            throw new Error("Manager is not assigned to a department.");
        }

        console.log("Executing query:", query, "with params:", departmentId ? [departmentId] : []);
        const result = departmentId
            ? await client.query(query, [departmentId])
            : await client.query(query);

        console.log("Query result rows:", result.rows); // Log rows for debugging
        return result.rows;
    } catch (error) {
        throw new Error("Error retrieving employees: " + error.message);
    } finally {
        client.release();
    }
}



/**
 * Updates an employee's details.
 * @param {number} id - The employee ID.
 * @param {Object} updates - The fields to update.
 * @param {string} updates.firstName - Updated first name.
 * @param {string} updates.lastName - Updated last name.
 * @param {string} updates.email - Updated email.
 * @param {number} updates.roleId - Updated role ID.
 * @param {number} updates.departmentId - Updated department ID.
 * @returns {Object} The updated employee data.
 */
export async function updateEmployee(id, { first_name, last_name, email, department_id }) {
    const client = await pool.connect();
    try {
        const query = `
            UPDATE employees
            SET first_name = $1, last_name = $2, email = $3, department_id = $4
            WHERE user_id = $5
            RETURNING *;
        `;
        const result = await client.query(query, [first_name, last_name, email, department_id, id]);
        if (result.rows.length === 0) {
            throw new Error("Employee not found");
        }
        return result.rows[0];
    } catch (error) {
        throw new Error("Error updating employee: " + error.message);
    } finally {
        client.release();
    }
}


/**
 * Deletes an employee by ID.
 * @param {number} id - The employee ID.
 * @returns {string} A confirmation message.
 */
export async function deleteEmployee(id) {
    const client = await pool.connect();
    try {
        const query = `DELETE FROM employees WHERE user_id = $1 RETURNING *;`;
        const result = await client.query(query, [id]);
        if (result.rows.length === 0) {
            throw new Error("Employee not found");
        }
        return `Employee with ID ${id} deleted successfully`;
    } catch (error) {
        throw new Error("Error deleting employee: " + error.message);
    } finally {
        client.release();
    }
}
