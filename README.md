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
- [Docker Deployment](#docker-deployment)
- [Tech Stack](#tech-stack)
- [Contributing](#contributing)

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

## System Architecture

This system follows a **Model-View-Controller (MVC)** architecture:

1. **Model**: Represents the database schema (Employees, Roles, Departments).
2. **View**: API responses in JSON format.
3. **Controller**: Business logic to handle requests and interact with the models.
4. **Middleware**: Authentication and authorization handling.

## Database Structure

The database consists of the following tables:

1. **Employees**: Stores employee data such as name, email, department_id, and role_id.
2. **Roles**: Stores role definitions like Admin, Manager, and Employee.
3. **Departments**: Stores department names and associated details.

### Relationships:
- An **Employee** belongs to a **Department** and has a specific **Role**.
- A **Department** can have multiple employees.
- A **Role** can be assigned to multiple employees.

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
    department_id INT REFERENCES departments(id),
    role_id INT REFERENCES roles(id)
);
