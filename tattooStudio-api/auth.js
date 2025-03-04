require("dotenv").config();
const jwt = require("jsonwebtoken");
const express = require("express");

const router = express.Router();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;

router.post("/login", (req, res) => {
  const { password } = req.body;
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "1h" });

  res.json({ token });
});

const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }

    req.user = decoded;
    next();
  });
};

router.get("/admin", authenticate, (req, res) => {
  res.json({ message: "Welcome, Admin!" });
});

module.exports = {
  authRouter: router,
  authenticate,
};
