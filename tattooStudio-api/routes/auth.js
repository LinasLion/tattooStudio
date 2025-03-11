require("dotenv").config();
const jwt = require("jsonwebtoken");
const express = require("express");
const {generateToken, JWT_EXPIRY} = require("../services/authService");

const router = express.Router();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;

router.post("/login", (req, res) => {
    console.log("POST /login");
    const {password} = req.body;
    if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({error: "Unauthorized"});
    }

    try {
        const token = generateToken({role: "admin"});

        res.json({
            token, expiresIn: JWT_EXPIRY
        });
    } catch (error) {
        console.error("Token generation error:", error);
        res.status(500).json({error: "Authentication failed"});
    }
});

const authenticate = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        return res.status(401).json({error: "No token provided"});
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({error: "Invalid token"});
        }

        req.user = decoded;
        next();
    });
};

module.exports = {
    authRouter: router, authenticate,
};
