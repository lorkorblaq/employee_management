import express from "express";
import { checkPermissions } from "../../middleware/permission.middleware.js";
import {
    createRoleController,
    getRoleController,
    updateRoleController,
    deleteRoleController,
} from "../../controllers/roleController.js";

const router = express.Router();

router.use(checkPermissions(["manage_roles"])); // Apply to all routes under this router

router.post("/", createRoleController); // Create a role
router.get("/:id", getRoleController); // Get a role by ID
router.put("/:id", updateRoleController); // Update a role
router.delete("/:id", deleteRoleController); // Delete a role

export default router;