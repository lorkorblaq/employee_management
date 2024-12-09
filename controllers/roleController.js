import {
    createRole,
    getRoleById,
    updateRole,
    deleteRole,
} from "../services/roleService.js";

/**
 * Handles creating a new role.
 */
export async function createRoleController(req, res) {
    try {
        const { name, permissions } = req.body;

        if (!name || !permissions) {
            return res.status(400).json({ error: "Name and permissions are required" });
        }

        const role = await createRole(name, permissions);
        res.status(201).json(role);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

/**
 * Handles retrieving a role by ID.
 */
export async function getRoleController(req, res) {
    try {
        const { id } = req.params;
        const role = await getRoleById(id);
        res.status(200).json(role);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

/**
 * Handles updating a role.
 */
export async function updateRoleController(req, res) {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (!updates.name && !updates.permissions) {
            return res.status(400).json({ error: "No updates provided" });
        }

        const updatedRole = await updateRole(id, updates);
        res.status(200).json(updatedRole);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

/**
 * Handles deleting a role by ID.
 */
export async function deleteRoleController(req, res) {
    try {
        const { id } = req.params;
        const message = await deleteRole(id);
        res.status(200).json({ message });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
