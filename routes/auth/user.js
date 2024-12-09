import express from "express";
import { signup, login, getUserProfile } from "../../controllers/auth/userController.js";
import authMiddleware from "../../middleware/auth.middleware.js";

const router = express.Router();

// Route to sign up a new user
router.post("/signup", signup);

// Route to log in an existing user
router.post("/login", login);

// Route to get the user's profile (requires authentication)
router.get("/profile", authMiddleware, getUserProfile);

export default router;
