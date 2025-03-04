require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { authRouter, authenticate } = require("./auth"); // Import both

const app = express();
app.use(express.json());
app.use(cors());

app.use("/auth", authRouter);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
