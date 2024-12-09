import express from "express";
import { login } from "../../controllers/auth/userController.js";

const router = express.Router();


// Route to log in an existing user
router.post("/login", login);

export default router;
