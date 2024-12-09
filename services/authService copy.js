import { pool } from "../database/connect.js";  // PostgreSQL connection pool
import { generateJWT, hashPassword, verifyPassword } from "../utils/cryptoUtils.js";

/**
 * Creates a new user account.
 * @param {string} email - The email address of the user.
 * @param {string} password - The plaintext password to be hashed.
 * @param {int} role_id - The name of the user.
 * @returns {Object} The created user and a generated JWT token.
 * @throws {Error} Throws an error if the user already exists.
 */
export async function createUser(email, role_id, password) {
    const client = await pool.connect();
    try {
        // Checking if a user already exists with the given email
        const existingUserQuery = `SELECT id FROM users WHERE email = $1`;
        const existingUserResult = await client.query(existingUserQuery, [email]);

        if (existingUserResult.rows.length > 0) {
            // If user exists, throw an error
            throw new Error("User already exists");
        }

        // Hash the password and generate a salt
        const { salt, hashedPassword } = hashPassword(password);

        // Insert the new user into the database
        const insertUserQuery = `
        INSERT INTO users (email, role_id, password_hash, salt)
        VALUES ($1, $2, $3, $4)
        RETURNING id, email;
        `;
    
        const newUserResult = await client.query(insertUserQuery, [email, role_id, hashedPassword, salt]);
        const user = newUserResult.rows[0];

        // Generate a JWT token for the new user
        const token = generateJWT(user);

        // Return the created user and the JWT token
        return { user, token };
    } catch (error) {
        throw new Error("Error creating user: " + error.message);
    } finally {
        client.release();
    }
}

/**
 * Authenticates a user using their email and password.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's plaintext password.
 * @returns {Object} The authenticated user and the generated JWT token.
 * @throws {Error} Throws an error if the user is not found or if the password is invalid.
 */
export async function authenticateUser(email, password) {
    const client = await pool.connect();
    try {
        // Query the database to find a user by their email
        const userQuery = `
            SELECT id, role_id, email, password_hash, salt 
            FROM users 
            WHERE email = $1
        `;
        const userResult = await client.query(userQuery, [email]);

        if (userResult.rows.length === 0) {
            // If no user is found, throw an error
            throw new Error("User not found");
        }

        // Get the user from the query result
        const user = userResult.rows[0];

        // Verify the password using the hashed password and salt stored in the database
        const isMatch = verifyPassword(user.password_hash, user.salt, password);
        if (!isMatch) {
            // If the password doesn't match, throw an error
            throw new Error("Invalid credentials");
        }

        // Generate a JWT token for the authenticated user
        const token = generateJWT(user);

        // Return the user and the generated token
        return { user, token };
    } catch (error) {
        throw new Error("Error authenticating user: " + error.message);
    } finally {
        client.release();
    }
}

/**
 * Retrieves a user by their ID.
 * @param {string} userId - The unique identifier for the user.
 * @returns {Object} The user object from the database.
 * @throws {Error} Throws an error if there is an issue fetching the user.
 */
export async function getUserById(userId) {
    const client = await pool.connect();
    try {
        // Query the database to fetch the user by their ID
        const userQuery = `
            SELECT id, role_id, email 
            FROM users 
            WHERE id = $1
        `;
        const userResult = await client.query(userQuery, [userId]);

        if (userResult.rows.length === 0) {
            throw new Error("User not found");
        }

        // Return the user if found
        return userResult.rows[0];
    } catch (error) {
        throw new Error("Error fetching user: " + error.message);
    } finally {
        client.release();
    }
}
