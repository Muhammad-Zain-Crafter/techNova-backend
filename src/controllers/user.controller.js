import { sql } from "../db/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// generate token
const generateToken = (user) => {
    return jwt.sign({id: user.userid, role: user.role}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d"
    })
}

const registerUser = async (req, res) => {
    const {name, email, password, role} = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(400).json({ error: "Please provide all required fields" });
        }
        const existedUser = await sql`SELECT * FROM users WHERE email = ${email}`;
        if (existedUser.length > 0) {
            return res.status(400).json({ error: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await sql`
            INSERT INTO users (name, email, password, role) values (${name}, ${email}, ${hashedPassword}, ${role || 'user'})
            RETURNING userid, name, email, role
        `;
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: newUser[0],
            token: generateToken(newUser[0])
        })

    } catch (error) {
        console.error("REGISTER ERROR:", error);
        res.status(500).json({ error: "Server error" });
    }
}

const loginUser = async (req, res) => {
    const {email, password} = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ error: "Please provide all required fields" });
        }

        const user = await sql `SELECT * FROM users WHERE email = ${email}`;
        if (user.length === 0) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const validPassword = await bcrypt.compare(password, user[0].password);
        if (!validPassword) {
            return res.status(400).json({ error: "Invalid password" });
        }

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                id: user[0].userid,
                name: user[0].name,
                email: user[0].email,
                role: user[0].role
            },
            token: generateToken(user[0])
        })
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
}

const logoutUser = (req, res) => {
    // Since JWT is stateless, we can't truly "log out" on the server side.
    // The client should simply delete the token on their end.  
    res.status(200).json({ message: "Logout successful. Please delete the token on the client side." });
}

export { registerUser, loginUser, logoutUser }