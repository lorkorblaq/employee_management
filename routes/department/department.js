import express from "express";
import { checkPermissions } from "../../middleware/permission.middleware.js";
import {
    createDepartmentController,
    getDepartmentController,
    getAllDepartmentsController,
    updateDepartmentController,
    deleteDepartmentController,
} from "../../controllers/departmentController.js";

const router = express.Router();

router.post("/", checkPermissions(["manage_departments"]), createDepartmentController); // Create a department
router.get("/", checkPermissions(["manage_departments"]), getAllDepartmentsController); // Get all departments
router.get("/:id", checkPermissions(["manage_departments"]), getDepartmentController); // Get a department by ID
router.put("/:id", checkPermissions(["manage_departments"]), updateDepartmentController); // Update a department
router.delete("/:id", checkPermissions(["manage_departments"]), deleteDepartmentController); // Delete a department

export default router;
