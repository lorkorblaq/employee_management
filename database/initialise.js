import { randomBytes, pbkdf2 } from 'crypto';
import { pool } from './connect.js';
import { createRolesTable } from './models/roles.model.js';
import { createDepartmentsTable } from './models/departments.model.js';
import { createEmployeesTable } from './models/employees.model.js';
import { createUsersTable } from './models/users.model.js';
import readline from 'readline';

// Define initial roles
const initialRoles = [
  {
    name: "admin",
    permissions: [
      "manage_employees",
      "manage_roles",
      "manage_departments"
    ]
  },
  {
    name: "Manager",
    permissions: [
      "manage_employees",
    ],
  },
  {
    name: "Employee",
    permissions: [
      "view_self"
    ]
  }
];

// Create a readline interface to capture user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

export const initializeTables = async () => {
  console.log("Initializing tables...");

  const tableSchemas = [
    { createTable: createRolesTable, name: "roles" },
    { createTable: createDepartmentsTable, name: "departments" },
    { createTable: createUsersTable, name: "users" },
    { createTable: createEmployeesTable, name: "employees" },
  ];

  const client = await pool.connect();

  try {
    // Create the tables if they don't exist
    for (const { createTable, name } of tableSchemas) {
      console.log(`Checking table "${name}"...`);
      const tableCheckQuery = `
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = $1
        ) AS table_exists;
      `;
      const res = await client.query(tableCheckQuery, [name]);

      if (res.rows[0].table_exists) {
        console.log(`Table "${name}" already exists.`);
      } else {
        console.log(`Creating table "${name}"...`);
        await client.query(createTable);
        console.log(`Table "${name}" created successfully.`);
      }
    }

    // Check if the unique constraint already exists
    const checkConstraintQuery = `
      SELECT 1 
      FROM information_schema.table_constraints 
      WHERE table_name = 'roles' 
      AND constraint_name = 'unique_role_name';
    `;
    const constraintExistsResult = await client.query(checkConstraintQuery);

    if (constraintExistsResult.rows.length === 0) {
      console.log("Adding unique constraint to 'roles' table...");
      const alterTableQuery = `
        ALTER TABLE roles
        ADD CONSTRAINT unique_role_name UNIQUE (name);
      `;
      await client.query(alterTableQuery);
      console.log("Unique constraint added to 'roles' table.");
    } else {
      console.log("Unique constraint 'unique_role_name' already exists.");
    }

    // Insert roles into the roles table
    console.log("Inserting roles...");
    for (const role of initialRoles) {
      const insertRoleQuery = `
        INSERT INTO roles (name, permissions)
        VALUES ($1, $2)
        ON CONFLICT (name) DO NOTHING;  -- Ensures roles are only inserted once
      `;
      await client.query(insertRoleQuery, [role.name, JSON.stringify(role.permissions)]);
      console.log(`Role "${role.name}" processed.`);
    }

    // Check if an admin user already exists
    const checkAdminUserQuery = `SELECT 1 FROM users WHERE role_id = (SELECT id FROM roles WHERE name = 'admin')`;
    const adminExistsResult = await client.query(checkAdminUserQuery);

    if (adminExistsResult.rows.length === 0) {
      const email = process.env.ADMIN_EMAIL;
      const password = process.env.ADMIN_PASSWORD;
      // Define the first admin user
      const firstAdminUser = {
        email: email,
        password: password,
        roleName: 'admin'
      };

      // Get the role_id for the "admin" role
      const getRoleQuery = `SELECT id FROM roles WHERE name = $1`;
      const adminRoleResult = await client.query(getRoleQuery, [firstAdminUser.roleName]);

      if (adminRoleResult.rows.length > 0) {
        const adminRoleId = adminRoleResult.rows[0].id;

        // Hash the admin password using crypto
        const salt = randomBytes(16).toString('hex'); // Generate a 16-byte salt
        const hashedPassword = await new Promise((resolve, reject) => {
          pbkdf2(password, salt, 100000, 64, 'sha512', (err, derivedKey) => {
            if (err) reject(err);
            resolve(derivedKey.toString('hex')); // Return the hashed password as hex
          });
        });

        // Create the first admin user
        const insertAdminQuery = `
          INSERT INTO users (email, password_hash, salt, role_id)
          VALUES ($1, $2, $3, $4)
          RETURNING id, email;
        `;

        try {
          const adminUserResult = await client.query(insertAdminQuery, [
            firstAdminUser.email,
            hashedPassword,
            salt,
            adminRoleId
          ]);
          console.log(`Admin user created successfully: ${adminUserResult.rows[0].email}`);
        } catch (err) {
          console.error("Error creating admin user:", err.message);
        }
      } else {
        console.log("Admin role not found, skipping admin user creation.");
      }
    } else {
      console.log("Admin user already exists.");
    }

  } catch (err) {
    console.error("Error during table initialization:", err.message);
  } finally {
    client.release();
    rl.close();  // Close the readline interface once done
  }

  console.log("Table initialization complete.");
};
