import { sql } from "../db/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { io } from "../index.js";
// generate token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.userid, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    },
  );
};

const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }
    const existedUser = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (existedUser.length > 0) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await sql`
            INSERT INTO users (name, email, password, role) values (${name}, ${email}, ${hashedPassword}, ${role || "user"})
            RETURNING userid, name, email, role
        `;
    io.emit("user_registered", {
      user: newUser[0],
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: newUser[0],
      token: generateToken(newUser[0]),
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({
      success: false,
      message: "User already exists",
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Please provide all required fields" });
    }

    const user = await sql`SELECT * FROM users WHERE email = ${email}`;
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
        role: user[0].role,
      },
      token: generateToken(user[0]),
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const getProfile = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await sql`
    SELECT userid, name, email, role FROM users WHERE userid = ${userId}`;
    if (user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({
      success: true,
      data: user[0],
    });
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user profile",
    });
  }
};

const logoutUser = (req, res) => {
  // Since JWT is stateless, we can't truly "log out" on the server side.
  // The client should simply delete the token on their end.
  res.status(200).json({
    message: "Logout successful. Please delete the token on the client side.",
  });
};

const updateDetails = async (req, res) => {
  const { name, email } = req.body;
  const userId = req.user.id;
  try {
    const user = await sql`SELECT * FROM users WHERE userid = ${userId}`;
    if (user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const updateUser = await sql`
            UPDATE users SET name = ${name || user[0].name}, email = ${email || user[0].email} WHERE userid = ${userId}
            RETURNING userid, name, email, role
        `;
    res.status(200).json({
      success: true,
      message: "User details updated successfully",
      data: updateUser[0],
    });
  } catch (error) {
    console.error("UPDATE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user details",
    });
  }
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  try {
    const user = await sql`SELECT * FROM users WHERE userid = ${userId}`;
    if (user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const validPassword = await bcrypt.compare(
      currentPassword,
      user[0].password,
    );
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid current password" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await sql`UPDATE users SET password = ${hashedPassword} WHERE userid = ${userId}`;

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("PASSWORD CHANGE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to change password",
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await sql`SELECT userid, name, email, role FROM users`;
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("GET ALL USERS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

const getDashboardStats = async (req, res) => {
  const products = await sql` SELECT COUNT(*) FROM products`;
  const users = await sql` SELECT COUNT(*) FROM users`;
  const orders = await sql` SELECT COUNT(*) FROM orders`;

  res.status(200).json({
    success: true,
    products: Number(products[0].count),
    users: Number(users[0].count),
    orders: Number(orders[0].count),
  });
};

export {
  registerUser,
  loginUser,
  logoutUser,
  getDashboardStats,
  updateDetails,
  changePassword,
  getAllUsers,
  getProfile,
};
