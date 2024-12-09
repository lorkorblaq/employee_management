// connect.js
import pkg from 'pg';  // Import the CommonJS module
import dotenv from 'dotenv';  // Import dotenv to manage environment variables
import { LoggerLib } from "../libs/Logger.lib.js";  // Import your logger library

dotenv.config();  // Load environment variables

const { Pool } = pkg;  // Destructure Pool from the pg module

// Load environment variables from .env file
const {
  PGHOST,
  PGUSER,
  PGPASSWORD,
  PGDATABASE,
  PGPORT,
} = process.env;

// Configure PostgreSQL connection pool
export const pool = new Pool({
  host: PGHOST || "localhost",
  user: PGUSER || "postgres",
  password: PGPASSWORD || "password",
  database: PGDATABASE || "kenkeputa",
  port: PGPORT || 5432,
});

// Function to test the connection to PostgreSQL
export async function connect() {
  try {
    const client = await pool.connect();  // Get a client from the pool
    const res = await client.query("SELECT NOW()");  // Test query to check server connection
    LoggerLib.log("Connected to PostgreSQL. Server time:", res.rows[0].now);  // Log the response
    client.release();  // Release the client back to the pool
  } catch (err) {
    LoggerLib.error("Failed to connect to PostgreSQL:", err.message);  // Log error if connection fails
  }
}
