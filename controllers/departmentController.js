import {
    createDepartment,
    getDepartmentById,
    getAllDepartments,
    updateDepartment,
    deleteDepartment,
} from "../services/departmentService.js";

/**
 * Handles creating a new department.
 */
export async function createDepartmentController(req, res) {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ error: "Department name is required" });
        }

        const department = await createDepartment(name);
        res.status(201).json(department);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

/**
 * Handles retrieving a department by ID.
 */
export async function getDepartmentController(req, res) {
    try {
        const { id } = req.params;
        const department = await getDepartmentById(id);
        res.status(200).json(department);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

/**
 * Handles retrieving all departments.
 */
export async function getAllDepartmentsController(req, res) {
    try {
        const departments = await getAllDepartments();
        res.status(200).json(departments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

/**
 * Handles updating a department.
 */
export async function updateDepartmentController(req, res) {
    try {
        const { id } = req.params;
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ error: "Department name is required" });
        }

        const updatedDepartment = await updateDepartment(id, name);
        res.status(200).json(updatedDepartment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

/**
 * Handles deleting a department by ID.
 */
export async function deleteDepartmentController(req, res) {
    try {
        const { id } = req.params;
        const message = await deleteDepartment(id);
        res.status(200).json({ message });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
