import { pool } from "../database/connect.js";

/**
 * Creates a new role in the database.
 * @param {string} name - The name of the role.
 * @param {Object} permissions - The permissions for the role (JSON object).
 * @returns {Object} The newly created role.
 */
export async function createRole(name, permissions) {
    const client = await pool.connect();
    try {
        const query = `
            INSERT INTO roles (name, permissions)
            VALUES ($1, $2)
            RETURNING *;
        `;
        const values = [name, JSON.stringify(permissions)];
        const result = await client.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw new Error("Error creating role: " + error.message);
    } finally {
        client.release();
    }
}

/**
 * Retrieves a role by its ID.
 * @param {number} id - The ID of the role.
 * @returns {Object} The role data.
 */
export async function getRoleById(id) {
    const client = await pool.connect();
    try {
        const query = `SELECT * FROM roles WHERE id = $1;`;
        const result = await client.query(query, [id]);
        if (result.rows.length === 0) {
            throw new Error("Role not found");
        }
        return result.rows[0];
    } catch (error) {
        throw new Error("Error retrieving role: " + error.message);
    } finally {
        client.release();
    }
}

/**
 * Updates a role in the database.
 * @param {number} id - The ID of the role.
 * @param {Object} updates - The updated fields (name and/or permissions).
 * @returns {Object} The updated role data.
 */
export async function updateRole(id, updates) {
    const client = await pool.connect();
    try {
        const fields = [];
        const values = [];
        let index = 1;

        if (updates.name) {
            fields.push(`name = $${index++}`);
            values.push(updates.name);
        }

        if (updates.permissions) {
            fields.push(`permissions = $${index++}`);
            values.push(JSON.stringify(updates.permissions));
        }

        if (fields.length === 0) {
            throw new Error("No updates provided");
        }

        values.push(id);
        const query = `
            UPDATE roles
            SET ${fields.join(", ")}
            WHERE id = $${index}
            RETURNING *;
        `;
        const result = await client.query(query, values);
        if (result.rows.length === 0) {
            throw new Error("Role not found");
        }
        return result.rows[0];
    } catch (error) {
        throw new Error("Error updating role: " + error.message);
    } finally {
        client.release();
    }
}

/**
 * Deletes a role by its ID.
 * @param {number} id - The ID of the role.
 * @returns {string} Confirmation message.
 */
export async function deleteRole(id) {
    const client = await pool.connect();
    try {
        const query = `DELETE FROM roles WHERE id = $1 RETURNING *;`;
        const result = await client.query(query, [id]);
        if (result.rows.length === 0) {
            throw new Error("Role not found");
        }
        return `Role with ID ${id} deleted successfully`;
    } catch (error) {
        throw new Error("Error deleting role: " + error.message);
    } finally {
        client.release();
    }
}
