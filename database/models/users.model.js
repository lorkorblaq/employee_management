export const createUsersTable = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255),
    salt VARCHAR(255),
    createdAt TIMESTAMP DEFAULT NOW(),
    role_id INTEGER REFERENCES roles(id)
  );
`;
