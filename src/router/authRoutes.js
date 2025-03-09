import express from "express";
import db from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();
router.post("/register", (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);
  try {
    const registerUser = db.prepare(
      `INSERT INTO users (username, password, admin) VALUES (?, ?, ?)`
    ).run(username, hashedPassword, 0);
    if(!registerUser)
    {
      return res.status(501).json({message: "User registration failed"})
    }
    const token = jwt.sign({ id: registerUser.lastInsertRowid }, process.env.JWT_SECRET_KEY , {
      expiresIn: "10m",
    });
    return res.status(201).json({ message: "User registered successfully" ,
      "token": token,
    
      
    });
  } catch (err) {
    return res.status(501).json({ error: err.message });
  }
});
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.get("SELECT * FROM users WHERE username = ?", [username], (err, getUser) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!getUser) {
      return res.status(401).json({ message: "Invalid username" });
    }

    const decryptedPassword = bcrypt.compareSync(password, getUser.password);
    if (!decryptedPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: getUser.id }, process.env.JWT_SECRET_KEY, { expiresIn: "10m" });
    return res.status(200).json({ message: "User logged in successfully", token, id: getUser.id });
  });
});

export default router;
