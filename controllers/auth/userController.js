import { createUser, authenticateUser, getUserById } from "../../services/authService.js";

/**
 * Handles user signup by creating a new user.
 * @param {Object} req - The request object containing user details in the body.
 * @param {Object} res - The response object used to send the response.
 */
export async function signup(req, res) {
    try {
        // Destructure user details from the request body
        const { role_id, email, password } = req.body;

        // Ensure that both email and password are provided
        if (!email || !password || !role_id) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        // Create a new user using the provided details (without FHIRid)
        const result = await createUser(role_id, email, password);
        
        // Respond with the created user and a 201 status code
        res.status(201).json(result);
    } catch (error) {
        // Handle any errors that occur during user creation
        res.status(400).json({ error: error.message });
    }
}

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

/**
 * Fetches the authenticated user's profile.
 * @param {Object} req - The request object containing the authenticated user data (set by authMiddleware).
 * @param {Object} res - The response object used to send the response.
 */
export async function getUserProfile(req, res) {
    try {
        // Access the authenticated user's ID from the request object (set by authentication middleware)
        const userId = req.user.id;

        // Fetch the user's profile from the database using the userId
        const user = await getUserById(userId);
        
        // If the user is not found, respond with a 404 status code
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        
        // Respond with the user profile and a 200 status code
        res.status(200).json(user);
    } catch (error) {
        // Catch any unexpected errors and respond with a 500 status code
        res.status(500).json({ error: error.message });
    }
}
