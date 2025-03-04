require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { authRouter }= require("./routes/auth"); // Import both
const postsRouter = require("./routes/posts");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/auth", authRouter);
app.use("/posts", postsRouter);


const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
