import { pool } from "../database/connect.js";

export async function getDepartmentByUserId(userId) {
    const client = await pool.connect();
    try {
        const query = `
            SELECT department_id 
            FROM employees 
            WHERE user_id = $1
        `;
        const result = await client.query(query, [userId]);
        return result.rows[0] || null;
    } catch (error) {
        throw new Error("Error retrieving department: " + error.message);
    } finally {
        client.release();
    }
}

/**
 * Creates a new department.
 * @param {string} name - The name of the department.
 * @returns {Object} The created department.
 */
export async function createDepartment(name) {
    const client = await pool.connect();
    try {
        const query = `
            INSERT INTO departments (name)
            VALUES ($1)
            RETURNING *;
        `;
        const result = await client.query(query, [name]);
        return result.rows[0];
    } catch (error) {
        throw new Error("Error creating department: " + error.message);
    } finally {
        client.release();
    }
}

/**
 * Retrieves a department by its ID.
 * @param {number} id - The ID of the department.
 * @returns {Object} The department data.
 */
export async function getDepartmentById(id) {
    const client = await pool.connect();
    try {
        const query = `SELECT * FROM departments WHERE id = $1;`;
        const result = await client.query(query, [id]);
        if (result.rows.length === 0) {
            throw new Error("Department not found");
        }
        return result.rows[0];
    } catch (error) {
        throw new Error("Error retrieving department: " + error.message);
    } finally {
        client.release();
    }
}

/**
 * Retrieves all departments.
 * @returns {Array} A list of all departments.
 */
export async function getAllDepartments() {
    const client = await pool.connect();
    try {
        const query = `SELECT * FROM departments;`;
        const result = await client.query(query);
        return result.rows;
    } catch (error) {
        throw new Error("Error retrieving departments: " + error.message);
    } finally {
        client.release();
    }
}

/**
 * Updates a department.
 * @param {number} id - The ID of the department.
 * @param {string} name - The updated name of the department.
 * @returns {Object} The updated department data.
 */
export async function updateDepartment(id, name) {
    const client = await pool.connect();
    try {
        const query = `
            UPDATE departments
            SET name = $1
            WHERE id = $2
            RETURNING *;
        `;
        const result = await client.query(query, [name, id]);
        if (result.rows.length === 0) {
            throw new Error("Department not found");
        }
        return result.rows[0];
    } catch (error) {
        throw new Error("Error updating department: " + error.message);
    } finally {
        client.release();
    }
}

/**
 * Deletes a department by its ID.
 * @param {number} id - The ID of the department.
 * @returns {string} A confirmation message.
 */
export async function deleteDepartment(id) {
    const client = await pool.connect();
    try {
        const query = `DELETE FROM departments WHERE id = $1 RETURNING *;`;
        const result = await client.query(query, [id]);
        if (result.rows.length === 0) {
            throw new Error("Department not found");
        }
        return `Department with ID ${id} deleted successfully`;
    } catch (error) {
        throw new Error("Error deleting department: " + error.message);
    } finally {
        client.release();
    }
}
