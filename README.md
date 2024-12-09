# kenkeputa_task
# Employee Management System with Role-Based Access Control (RBAC)

This is a backend API for an Employee Management System that implements Role-Based Access Control (RBAC). The API supports managing employees, roles, and departments while ensuring secure access to various endpoints based on the user’s role.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Database Structure](#database-structure)
- [Setup and Configuration](#setup-and-configuration)
- [API Endpoints](#api-endpoints)
- [Role Permissions](#role-permissions)
- [Error Handling and Validation](#error-handling-and-validation)
- [Tech Stack](#tech-stack)

## Overview

This API allows users to manage employees, roles, and departments with specific access control based on roles. The roles are structured as follows:

- **Admin**: Full access to manage employees, roles, and departments.
- **Manager**: Can manage employees within their department, but cannot manage roles or departments.
- **Employee**: Can only view their own personal information.

The goal is to provide a scalable and clean API design that supports CRUD operations while enforcing security through RBAC.

## Features

- CRUD operations for Employees, Roles, and Departments.
- Role-based access control for endpoints.
- Secure authentication and authorization with JWT tokens.
- Validation of incoming data.
- Error handling for different failure scenarios.

## System-architecture

This system follows a **Model-View-Controller (MVC)** architecture, which is a widely used design pattern to structure applications. It helps in separating concerns, improving code maintainability, and making it easier to scale the application. Below is an overview of how each component works in the context of this system:

---

### **1. Model**

The **Model** is responsible for representing the database schema and handling the data interaction. It defines the structure of the data that the application operates on, such as Employees, Roles, and Departments. Models encapsulate the logic needed to interact with the database and return data to the Controller.

In this application, we have:
- **Employees**: Stores employee details (e.g., name, email, department).
- **Roles**: Defines roles such as Admin, Manager, and Employee.
- **Departments**: Stores department-related information, linking employees to their respective departments.

The models are used by the **Controller** and **Service** layers to fetch, create, update, or delete data from the database.

---

### **2. View**

The **View** is responsible for presenting data to the user, usually in the form of HTML or JSON. In this system, the View consists of API responses formatted as JSON, which are returned to the client (e.g., frontend or API consumers). 

For instance:
- When a request is made to view an employee, the View will send back a JSON response with the employee’s data.
- When an employee is updated, the View will return a JSON response confirming the update.

In summary, the View is what the user interacts with, which in this case is the API's JSON output.

---

### **3. Controller**

The **Controller** contains the business logic and acts as a middle layer between the **Model** and the **View**. It is responsible for receiving requests from the user (via routes), processing them, interacting with the **Model** and **Service** to retrieve or manipulate data, and then sending the appropriate **View** (response).

Here’s an example of how the Controller interacts with the Model and Service:
- A request comes in to view an employee's details.
- The Controller checks the request, verifies if the employee exists by querying the **Employee Model** and uses the **Service** to manage business rules (such as permission checks).
- The Controller then sends back the corresponding data in JSON format (via the **View**).

In this system, controllers handle different functionalities, including:
- Fetching and displaying employee data.
- Handling employee creation, updates, and deletion.
- Filtering employees by roles or departments.
- Ensuring business rules are adhered to (such as managers only viewing employees in their department).

---

### **4. Service**

The **Service** layer contains the core business logic of the application. It is separate from the **Controller** to allow for a more modular and testable structure. The **Service** interacts with the **Model** to perform CRUD operations (Create, Read, Update, Delete) and enforces the business rules of the application. 

- **Employee Service**: Manages the logic related to employee data, such as fetching employee details, updating employee records, or filtering employees based on roles or departments.
- **Role Service**: Handles role-specific logic, such as permission management and role-based access control (RBAC).
- **Department Service**: Contains logic to manage department-specific operations.

The **Controller** delegates business logic to the **Service** layer, ensuring that the controller remains focused on request handling and response formatting.

For example:
- The **Controller** may call a **Service** to fetch employees within a manager’s department or apply certain business rules (like filtering based on role and department).

---

### **5. Middleware**

**Middleware** serves as an intermediary between the request and the Controller. It is responsible for tasks such as authentication, authorization, and validation before the request reaches the controller.

- **Authentication Middleware**: Verifies if the request has a valid JWT token or session to authenticate the user.
- **Authorization Middleware**: Ensures that users have the necessary permissions to perform actions like updating or deleting employees (e.g., Admins can manage all employees, Managers can only manage employees in their department).
- **Validation Middleware**: Validates incoming request data to ensure it conforms to expected formats (e.g., checking that required fields are provided).

---

### **6. Routes**

The **Routes** are responsible for handling incoming requests and delegating them to the appropriate **Controller**. They define the available API endpoints and connect those endpoints to the **Controller** functions.

Additionally, routes are responsible for integrating **Middleware** to ensure that requests are properly authenticated and authorized before they reach the business logic layer.

- **Auth Routes**: Handles login, signup, and token validation.
- **Employee Routes**: Handles routes for managing employees, such as viewing, creating, updating, and deleting employee data.
- **Role Routes**: Manages role-related operations and permissions.
- **Department Routes**: Manages department-related operations.

The routes are typically structured to include **middleware for permissions** and **authentication checks**. For example, before a user can create, update, or delete an employee, the **permission middleware** checks if the user has the appropriate role (Admin or Manager) to perform that action.

---

### **Example Flow of Request Handling**

1. **Route**: When a user requests to get all employees (`GET /employees`), the route handler calls the corresponding controller method (`getAllEmployeesController`).
   
2. **Middleware**: Before reaching the controller, the request passes through middleware:
   - The **authentication middleware** checks if the user is authenticated.
   - The **authorization middleware** checks if the user has the correct permissions (e.g., Admin, Manager, or Employee).
   
3. **Controller**: If the request passes the middleware, the **controller** is responsible for executing the business logic:
   - The controller may query the **Model** to fetch employee data based on certain criteria (like the user’s role or department).
   - It processes the response and returns it in JSON format to the **View**.

4. **Service**: The **Service** layer is called by the Controller to enforce business rules (e.g., a Manager can only see employees within their department).

5. **View**: Finally, the **View** sends the response (a JSON object) to the client.

---

### **Summary of MVC Responsibilities**

- **Model**: Represents the application's data and database schema.
- **View**: Formats the data into JSON responses to be sent to the client.
- **Controller**: Contains the business logic, handling requests, interacting with the Model and Service, and sending the response via the View.
- **Service**: Handles core business logic and enforces application rules.
- **Middleware**: Manages tasks like authentication, authorization, and validation before requests reach the Controller.
- **Routes**: Define available API endpoints and connect those endpoints to the Controller, including middleware for permissions and authentication.

By following this MVC architecture, the system ensures clear separation of concerns, making it easier to manage, scale, and extend in the future.


## Database Structure

The database consists of the following tables:

1. **Employees**: Stores employee data such as name, email, department_id, and role_id.
2. **Roles**: Stores role definitions like Admin, Manager, and Employee.
3. **Departments**: Stores department names and associated details.

### Example Schema (PostgreSQL):
```sql
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    permissions JSONB
);

CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,  -- Foreign key to users table
    department_id INT REFERENCES departments(id),
    role_id INT REFERENCES roles(id)
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INT REFERENCES roles(id) ON DELETE SET NULL,
    department_id INT REFERENCES departments(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

```
### Database Relationships

The relationships between the tables in the database represent the core structure of the application. These relationships help define how different entities like **employees**, **roles**, **departments**, and **users** are connected, ensuring proper data integrity and allowing for meaningful data interactions.

---

### **1. Employees Table**
The **employees** table stores detailed information about the employees, such as their name, email, department, and role. An employee is linked to both a **user** and a **department**, and each employee also has an associated **role**. 

- **user_id**: Links to the **users** table, establishing a one-to-one relationship between an employee and a user record. The employee is connected to a user account, which contains sensitive information like the password and email.
- **department_id**: Links to the **departments** table, creating a many-to-one relationship between employees and departments (i.e., multiple employees can belong to the same department).
- **role_id**: Links to the **roles** table, establishing a many-to-one relationship between employees and roles (i.e., multiple employees can have the same role, such as "Manager" or "Employee").

### **2. Roles Table**
The **roles** table defines various roles that can be assigned to users or employees. Each role has a `name` (such as "Admin", "Manager", or "Employee") and a set of `permissions` stored in a JSONB column. Permissions allow fine-grained control over what a user can do within the system (e.g., managing employees, viewing certain resources, etc.).

- **Permissions**: This is a JSONB column that stores permissions for each role. It can include various capabilities such as creating, reading, updating, or deleting records.
- **Relationship with Employees**: A role is assigned to one or more employees. The **role_id** in the employees table points to a specific role, dictating what actions the employee can perform within the system.

### **3. Departments Table**
The **departments** table stores information about different departments in the organization, such as HR, IT, or Sales. 

- **Relationship with Employees**: Each employee belongs to a specific department, and this relationship is maintained using the **department_id** in the employees table. One department can have multiple employees, establishing a one-to-many relationship between departments and employees.

### **4. Users Table**
The **users** table holds the authentication details for each user (such as their username, email, and password). The table also contains references to the **roles** and **departments** tables, meaning each user is associated with a specific role and optionally a department.

- **user_id in employees**: The **employees** table contains a **user_id** column, linking an employee to a user account in the **users** table. This relationship is essential for managing login credentials and authenticating users.
  
- **Role and Department for Users**: The **users** table contains a **role_id** (for linking the user to a specific role) and a **department_id** (for linking the user to a department). A user’s role dictates their level of access within the system, while the department links them to the organizational unit they belong to.

---

### **Relationships Summary**

1. **Employee ↔ User**: 
   - Each **employee** has a corresponding **user** in the system.
   - An employee can be linked to a user for authentication, and the user table stores sensitive data like email and password.
   - This is a **one-to-one** relationship.

2. **Employee ↔ Department**: 
   - An **employee** is assigned to a **department**, and each department can have many employees.
   - This is a **many-to-one** relationship where each employee belongs to a single department, but a department can have multiple employees.
  
3. **Employee ↔ Role**:
   - Each **employee** is assigned a **role**, which defines what they are allowed to do in the system. Multiple employees can share the same role.
   - This is a **many-to-one** relationship, where an employee has a single role, but a role can be assigned to multiple employees.
  
4. **User ↔ Role**:
   - A **user** is assigned a **role** (such as Admin, Manager, or Employee) through the **role_id** field.
   - This relationship defines what actions a user can perform within the system based on their role.
   - A **user** can only have one role, and each role can be assigned to multiple users.
   - This is a **many-to-one** relationship from users to roles.

5. **User ↔ Department**: 
   - A **user** can optionally belong to a **department**. This is used in the case where users are directly tied to a department (such as managers or department heads).
   - This is a **many-to-one** relationship, where multiple users can belong to the same department.
   
6. **Role ↔ Permissions**:
   - The **permissions** stored in the **roles** table define the capabilities of each role. Permissions are stored as a JSONB field, allowing for flexible, dynamic management.
   - This relationship dictates how a role can access and interact with the application.

---

### Visual Representation of Relationships:




## Setup and Configuration

Follow these steps to set up and configure the application in both local and production environments. The setup includes instructions for running the application using Docker containers.

---

### **Prerequisites**
1. Install [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) on your machine.
2. Ensure you have `npm` (Node.js package manager) installed for optional local setup.
3. (Optional) Use tools like [Postman](https://www.postman.com/) for testing APIs.
4. Docker image used are, node:slim22 and postgres:bullseye

---

### **1. Clone the Repository**
Clone the project from the repository to your local machine:
```bash
git clone <repository-url>
cd <project-folder>
```
### **2. Environment Configuration
Set up the environment variables by creating a .env file in the root of your project. Below is an example of the variables to include:
#### Application
- PORT=3000

#### Database
- DB_HOST=db
- DB_PORT=5432
- DB_USER=postgres
- DB_PASSWORD=yourpassword
- DB_NAME=yourdatabase
  
#### Admin Login
- ADMIN_EMAIL=yourLoginEmailAddress
- ADMIN_PASSWORD=yourLoginPassowrd

The ADMIN_EMAIL is automatically created as an admin and the ADMIN_PASSWORD is the login passoword 

#### JWT
- JWT_SECRET=your_jwt_secret

### **3. Using Docker Containers
Docker Images Used
- Node.js: For running the application server.
- PostgreSQL: For managing the application database.
3.2 Start Docker Containers
A docker-compose.yml file is included in the repository. Use the following command to start the containers:

```bash
docker-compose up --build
```
This will:

1. Build and run the Node.js application in one container.
2. Set up the PostgreSQL database in another container.

The services defined in docker-compose.yml include:
1. app: Runs the Node.js server.
2. db: Hosts the PostgreSQL database.



## API Endpoints

The following endpoints are available in the application, organized by functionality:

### **Employee Management**

- **Get All Employees**
  - **URL:** `/api/employees`
  - **Method:** `GET`
  - **Description:** Retrieve a list of employees.  
    - **Admins:** Can view all employees.  
    - **Managers:** Can view employees in their department.  
    - **Employees:** Can only view their own information.
  - **Authorization Required:** Yes (JWT Token)
  - **Response Example (Admin):**
    ```json
    [
      {
        "id": 1,
        "name": "John Doe",
        "role_id": 2,
        "role_name": "Manager",
        "department_id": 3,
        "department_name": "Human Resources"
      },
      {
        "id": 2,
        "name": "Jane Smith",
        "role_id": 3,
        "role_name": "Employee",
        "department_id": 3,
        "department_name": "Human Resources"
      }
    ]
    ```

- **Get Employee by ID**
  - **URL:** `/api/employees/:id`
  - **Method:** `GET`
  - **Description:** Retrieve details of a specific employee.  
    - **Admins:** Can view any employee.  
    - **Managers:** Can view employees in their department.  
    - **Employees:** Can only view their own information.
  - **Authorization Required:** Yes (JWT Token)
  - **Response Example:**
    ```json
    {
      "id": 1,
      "name": "John Doe",
      "role_id": 2,
      "role_name": "Manager",
      "department_id": 3,
      "department_name": "Human Resources"
    }
    ```

- **Create Employee**
  - **URL:** `/api/employees`
  - **Method:** `POST`
  - **Description:** Add a new employee to the system.
  - **Authorization Required:** Yes (Admin or Manager with `manage_employees` permission)
  - **Request Body Example:**
    ```json
    {
      "name": "John Doe",
      "role_id": 3,
      "department_id": 2,
      "email": "johndoe@example.com"
    }
    ```
  - **Response Example:**
    ```json
    {
      "message": "Employee created successfully",
      "employee": {
        "id": 4,
        "name": "John Doe",
        "role_id": 3,
        "department_id": 2,
        "email": "johndoe@example.com"
      }
    }
    ```

- **Update Employee**
  - **URL:** `/api/employees/:id`
  - **Method:** `PUT`
  - **Description:** Update employee details.
  - **Authorization Required:** Yes (Admin or Manager with `manage_employees` permission)
  - **Request Body Example:**
    ```json
    {
      "name": "Jane Doe",
      "department_id": 4
    }
    ```
  - **Response Example:**
    ```json
    {
      "message": "Employee updated successfully",
      "employee": {
        "id": 1,
        "name": "Jane Doe",
        "role_id": 3,
        "department_id": 4
      }
    }
    ```

- **Delete Employee**
  - **URL:** `/api/employees/:id`
  - **Method:** `DELETE`
  - **Description:** Remove an employee from the system.
  - **Authorization Required:** Yes (Admin or Manager with `manage_employees` permission)
  - **Response Example:**
    ```json
    {
      "message": "Employee deleted successfully"
    }
    ```
## Role Permissions

The following endpoints are available for managing roles and permissions in the system:

### **Role Management**

- **Get All Roles**
  - **URL:** `/api/roles`
  - **Method:** `GET`
  - **Description:** Retrieve a list of all roles in the system.
  - **Authorization Required:** Yes (Admins only)
  - **Response Example:**
    ```json
    [
      {
        "id": 1,
        "name": "Admin",
        "permissions": ["manage_employees", "manage_roles", "manage_departments"]
      },
      {
        "id": 2,
        "name": "Manager",
        "permissions": ["manage_employees"]
      },
      {
        "id": 3,
        "name": "Employee",
        "permissions": []
      }
    ]
    ```

- **Create Role**
  - **URL:** `/api/roles`
  - **Method:** `POST`
  - **Description:** Add a new role to the system.
  - **Authorization Required:** Yes (Admins only)
  - **Request Body Example:**
    ```json
    {
      "name": "Supervisor",
      "permissions": ["manage_employees"]
    }
    ```
  - **Response Example:**
    ```json
    {
      "message": "Role created successfully",
      "role": {
        "id": 4,
        "name": "Supervisor",
        "permissions": ["manage_employees"]
      }
    }
    ```

- **Update Role**
  - **URL:** `/api/roles/:id`
  - **Method:** `PUT`
  - **Description:** Update the details of a specific role.
  - **Authorization Required:** Yes (Admins only)
  - **Request Body Example:**
    ```json
    {
      "name": "Team Lead",
      "permissions": ["manage_employees", "view_reports"]
    }
    ```
  - **Response Example:**
    ```json
    {
      "message": "Role updated successfully",
      "role": {
        "id": 4,
        "name": "Team Lead",
        "permissions": ["manage_employees", "view_reports"]
      }
    }
    ```

- **Delete Role**
  - **URL:** `/api/roles/:id`
  - **Method:** `DELETE`
  - **Description:** Remove a role from the system.
  - **Authorization Required:** Yes (Admins only)
  - **Response Example:**
    ```json
    {
      "message": "Role deleted successfully"
    }
    ```

### **Permission Management**

- **Get Role Permissions**
  - **URL:** `/api/roles/:id/permissions`
  - **Method:** `GET`
  - **Description:** Retrieve the permissions assigned to a specific role.
  - **Authorization Required:** Yes (Admins only)
  - **Response Example:**
    ```json
    {
      "role_id": 2,
      "role_name": "Manager",
      "permissions": ["manage_employees"]
    }
    ```

- **Update Role Permissions**
  - **URL:** `/api/roles/:id/permissions`
  - **Method:** `PUT`
  - **Description:** Update the permissions assigned to a specific role.
  - **Authorization Required:** Yes (Admins only)
  - **Request Body Example:**
    ```json
    {
      "permissions": ["manage_employees", "view_reports"]
    }
    ```
  - **Response Example:**
    ```json
    {
      "message": "Permissions updated successfully",
      "role": {
        "id": 2,
        "name": "Manager",
        "permissions": ["manage_employees", "view_reports"]
      }
    }
    ```
## Department Management

The following endpoints are available for managing departments in the system:

### **Department Management**

- **Get All Departments**
  - **URL:** `/api/departments`
  - **Method:** `GET`
  - **Description:** Retrieve a list of all departments in the organization.
  - **Authorization Required:** Yes (Admins only)
  - **Response Example:**
    ```json
    [
      {
        "id": 1,
        "name": "Human Resources"
      },
      {
        "id": 2,
        "name": "Engineering"
      },
      {
        "id": 3,
        "name": "Sales"
      }
    ]
    ```

- **Create Department**
  - **URL:** `/api/departments`
  - **Method:** `POST`
  - **Description:** Add a new department to the organization.
  - **Authorization Required:** Yes (Admins only)
  - **Request Body Example:**
    ```json
    {
      "name": "Marketing"
    }
    ```
  - **Response Example:**
    ```json
    {
      "message": "Department created successfully",
      "department": {
        "id": 4,
        "name": "Marketing"
      }
    }
    ```

- **Update Department**
  - **URL:** `/api/departments/:id`
  - **Method:** `PUT`
  - **Description:** Update the details of an existing department.
  - **Authorization Required:** Yes (Admins only)
  - **Request Body Example:**
    ```json
    {
      "name": "Product Development"
    }
    ```
  - **Response Example:**
    ```json
    {
      "message": "Department updated successfully",
      "department": {
        "id": 2,
        "name": "Product Development"
      }
    }
    ```

- **Delete Department**
  - **URL:** `/api/departments/:id`
  - **Method:** `DELETE`
  - **Description:** Remove a department from the organization.
  - **Authorization Required:** Yes (Admins only)
  - **Response Example:**
    ```json
    {
      "message": "Department deleted successfully"
    }
    ```

### **Get Department by ID**
- **URL:** `/api/departments/:id`
  - **Method:** `GET`
  - **Description:** Retrieve information about a specific department.
  - **Authorization Required:** Yes (Admins and Managers)
  - **Response Example:**
    ```json
    {
      "id": 2,
      "name": "Engineering"
    }
    ```


## Error Handling and Validation

Effective error handling and validation are critical for building reliable and secure applications. In this project, both error handling and validation mechanisms are implemented to ensure that the application can handle issues gracefully and provide meaningful feedback to the users. Below is a detailed explanation of the error handling and validation strategies used in this application.

---

### **Error Handling**

1. **Try-Catch Blocks**:  
   - **Description**: A `try-catch` block is used extensively in the application to catch errors that occur during asynchronous operations such as database queries or API requests.
   - **Why it's used**: This structure helps capture unexpected errors and prevents the application from crashing. When an error is caught, a custom error message is returned to the user, ensuring a controlled failure.

2. **Error Middleware**:  
   - **Description**: The application uses custom error-handling middleware in Express.js to manage and format error responses.
   - **Why it's used**: By centralizing error handling in middleware, we ensure that all errors are formatted consistently and that sensitive error details (like stack traces) are not exposed to the user. This middleware also logs errors for further debugging.
   
   Example:
   ```javascript
   app.use((err, req, res, next) => {
       console.error(err.stack);
       res.status(500).json({
           message: "Something went wrong! Please try again later."
       });
   });




## Tech Stack

The application is built using a modern tech stack to ensure scalability, performance, and ease of development. Below is a comprehensive breakdown of the technologies used in the project.

---

### **Backend**

1. **Node.js**:  
   - **Description**: Node.js is a JavaScript runtime built on Chrome's V8 engine, enabling us to build scalable and efficient server-side applications.
   - **Why it's used**: Node.js is well-suited for building I/O-heavy applications like REST APIs due to its non-blocking, event-driven architecture.

2. **Express.js**:  
   - **Description**: Express is a minimal web application framework for Node.js, simplifying API development and routing.
   - **Why it's used**: It helps in quickly building RESTful APIs with robust features like middleware support, routing, and more.

---

### **Database**

1. **PostgreSQL**:  
   - **Description**: PostgreSQL is a powerful, open-source relational database management system (RDBMS) known for its reliability, flexibility, and extensibility.
   - **Why it's used**: PostgreSQL is ideal for handling complex queries and relationships, which makes it suitable for managing employee data, roles, and permissions in this application.

2. **Sequelize ORM** (Optional):
   - **Description**: Sequelize is a promise-based ORM for Node.js that supports multiple database engines, including PostgreSQL.
   - **Why it's used**: It simplifies database interaction by providing an abstraction layer that allows developers to write queries using JavaScript instead of raw SQL.

---

### **Authentication and Authorization**

1. **JWT (JSON Web Tokens)**:  
   - **Description**: JWT is an open standard for securely transmitting information between parties as a JSON object. It is widely used for authentication in web applications.
   - **Why it's used**: JWT allows secure stateless authentication and is used to authorize API requests by embedding user roles and permissions into the token.

---

### **Containerization and Deployment**

1. **Docker**:  
   - **Description**: Docker is a platform for developing, shipping, and running applications in containers.
   - **Why it's used**: Docker ensures the application runs consistently across different environments (local, development, production). It allows us to package the app along with its dependencies and configuration into containers.

2. **Docker Compose**:  
   - **Description**: Docker Compose is a tool for defining and running multi-container Docker applications. It allows us to define services (such as the web app and database) in a single file (`docker-compose.yml`) and manage them together.
   - **Why it's used**: Docker Compose simplifies the management of multi-container applications, enabling easy orchestration and configuration.

---

### **API Testing**

1. **Postman**:  
   - **Description**: Postman is a tool used for testing APIs by sending HTTP requests to endpoints and receiving responses.
   - **Why it's used**: It is a popular tool for quickly testing and documenting APIs without needing to write complex code.

---

### **Development Tools**

1. **VS Code**:  
   - **Description**: Visual Studio Code is a lightweight but powerful source code editor.
   - **Why it's used**: With features like IntelliSense, debugging, and extensions, VS Code is an ideal code editor for JavaScript and Node.js development.

2. **Git**:  
   - **Description**: Git is a distributed version control system to track changes in source code.
   - **Why it's used**: Git enables collaboration between multiple developers, easy versioning, and seamless code management.

---

---

### **Tech Stack Summary**
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Containerization**: Docker, Docker Compose
- **API Testing**: Postman
- **Development Tools**: VS Code, Git

