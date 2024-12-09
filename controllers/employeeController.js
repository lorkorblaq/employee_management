import {
    createEmployee,
    getEmployeeById,
    getAllEmployees,
    updateEmployee,
    deleteEmployee,
} from "../services/employeeService.js";

 import {getDepartmentByUserId} from "../services/departmentService.js";
/**
 * Handles creating a new employee.
 */
export async function createEmployeeController(req, res) {
    try {
        const { first_name, last_name, email, role_id, department_id, password } = req.body;
        console.log(req.body);
        if (!first_name || !last_name || !email || !role_id || !department_id || !password) {
            return res.status(400).json({ error: "First name, last name, and email are required" });
        }

        const employee = await createEmployee({ first_name, last_name, email, role_id, department_id, password });
        res.status(201).json(employee);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

/**
 * Handles retrieving an employee by ID.
 */
// export async function getEmployeeController(req, res) {
//     try {
//         const { id } = req.params;
//         const employee = await getEmployeeById(id);
//         res.status(200).json(employee);
//     } catch (error) {
//         res.status(404).json({ error: error.message });
//     }
// }

export async function getEmployeeController(req, res) {
    try {
        const { id } = req.params; // Employee ID from request params
        const { id: userId, role_id: userRole } = req.user; // Authenticated user info from JWT

        // Ensure employees can only view their own data
        if (userRole === 3 && parseInt(id) !== userId) {
            return res.status(403).json({ message: "You are only authorized to view your own information." });
        }

        // If the user is a Manager, ensure they can only view employees in their department
        if (userRole === 2) {
            // Fetch manager's department
            const managerDepartment = await getDepartmentByUserId(userId);

            if (!managerDepartment) {
                return res.status(403).json({ message: "You are not assigned to any department." });
            }

            // Check if the employee is in the same department as the manager
            const employee = await getEmployeeById(id);
            if (employee.department_id !== managerDepartment.department_id) {
                return res.status(403).json({ message: "You are only authorized to view employees in your department." });
            }

            return res.status(200).json(employee);
        }

        // For Admin or Employee roles, return the employee data
        const employee = await getEmployeeById(id);
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        res.status(200).json(employee);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}





// export async function getAllEmployeesController(req, res) {
//     try {
//         const { role_id: userRole, id: userId } = req.user;

//         // If the user is an employee, fetch only their own data
//         if (userRole === 3) {
//             const employee = await getEmployeeById(userId);
//             return res.status(200).json([employee]);
//         }

//         // Admins and managers can fetch all employees
//         const employees = await getAllEmployees();
//         res.status(200).json(employees);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// }

/**
 * Handles retrieving all employees.
 */
// export async function getAllEmployeesController(req, res) {
//     try {
//         const employees = await getAllEmployees();
//         res.status(200).json(employees);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// }


export async function getAllEmployeesController(req, res) {
    console.log("req.user", req.user);
    try {
        let { role_id: userRole, id: userId } = req.user; // Extract from JWT
        console.log("userRole", userRole, userId);
        let departmentId = null;
        let role = {
            1: "Admin",
            2: "Manager",
            3: "Employee",
        };
        userRole = role[userRole];

        if (userRole === "Employee") {
            const employee = await getEmployeeById(userId);
            return res.status(200).json([employee]);
        }

        if (userRole === "Manager") {
            const managerDepartment = await getDepartmentByUserId(userId);
            console.log("managerDepartment", managerDepartment);
            if (!managerDepartment) {
                return res.status(403).json({ message: "You are not assigned to a department." });
            }
            departmentId = managerDepartment.department_id;
        }

        const employees = await getAllEmployees(userRole, departmentId);
        res.status(200).json(employees);
    } catch (error) {
        console.error("Error retrieving employees:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}



/**
 * Handles updating an employee's details.
 */
export async function updateEmployeeController(req, res) {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedEmployee = await updateEmployee(id, updates);
        res.status(200).json(updatedEmployee);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

/**
 * Handles deleting an employee by ID.
 */
export async function deleteEmployeeController(req, res) {
    try {
        const { id } = req.params;
        const message = await deleteEmployee(id);
        res.status(200).json({ message });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
