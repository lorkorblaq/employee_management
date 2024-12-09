import { createUser, authenticateUser, getUserById } from "../../services/authService.js";

/**
 * Handles user login by authenticating the provided credentials.
 * @param {Object} req - The request object containing email and password in the body.
 * @param {Object} res - The response object used to send the response.
 */
export async function login(req, res) {
    try {
        // Destructure email and password from the request body
        const { email, password } = req.body;
        // Check if both email and password are provided
        if (!email || !password) {
            // Respond with a 400 error if either is missing
            return res.status(400).json({ error: "Email and password are required" });
        }

        // Authenticate the user using the provided credentials
        const result = await authenticateUser(email, password);
        
        // Respond with the authentication result and a 200 status code
        res.status(200).json(result);
    } catch (error) {
        // Log the error for debugging and respond with a 401 status code
        console.error(error);  // Log the error to understand it better
        res.status(401).json({ error: error.message });
    }
}
