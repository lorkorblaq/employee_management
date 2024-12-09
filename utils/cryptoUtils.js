import crypto from "crypto";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "1234567890"; // Use a secure secret key
const JWT_EXPIRATION = "1h"; // Set token expiration time

export function generateJWT(user) {
    const payload = {
        id: user.id,  
        role_id: user.role_id,    // Store user's ID in the payload
        email: user.email,
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
}

export function verifyJWT(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return null;
    }
}

// Hash password with salt using PBKDF2
export function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');  // Generate a random salt
    const hashedPassword = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
    return { salt, hashedPassword };
}

// Ppassword comparing the hash with the stored hash
export function verifyPassword(storedHash, storedSalt, password) {
    const hashedPassword = crypto.pbkdf2Sync(password, storedSalt, 100000, 64, 'sha512').toString('hex');
    return storedHash === hashedPassword;
}