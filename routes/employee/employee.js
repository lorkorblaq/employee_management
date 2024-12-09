import express from "express";
import { checkPermissions } from "../../middleware/permission.middleware.js";

import {
    createEmployeeController,
    getEmployeeController,
    getAllEmployeesController,
    updateEmployeeController,
    deleteEmployeeController,
} from "../../controllers/employeeController.js";

const router = express.Router();

// router.use(checkPermissions(["manage_employees"])); // Apply to all routes under this router

router.get("/",  getAllEmployeesController); // Get all employees
router.get("/:id", getEmployeeController); // Get an employee by ID
router.post("/", checkPermissions(["manage_employees"]), createEmployeeController); // Create an employee
router.put("/:id", checkPermissions(["manage_employees"]), updateEmployeeController); // Update an employee
router.delete("/:id", checkPermissions(["manage_employees"]), deleteEmployeeController); // Delete an employee

export default router;