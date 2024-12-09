import { Router } from 'express';
import auth from "./auth/index.js";
import department from "./department/index.js";
import employee from "./employee/index.js";
import role from "./role/index.js";
import authMiddleware from "../middleware/auth.middleware.js";
const router = Router();

// Public Routes
router.use('/', auth)

router.use(authMiddleware); // middleware globally to the routes below
// Private Routes
router.use('/', department)
router.use('/', employee)
router.use('/', role)
export default router;