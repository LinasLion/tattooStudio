require("dotenv").config();
const express = require("express");
const cors = require("cors");
const {authRouter} = require("./routes/auth"); // Import both
const postsRouter = require("./routes/posts");
const galleryRouter = require("./routes/gallery");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(cors());

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'], allowedHeaders: ['Content-Type', 'Authorization']
}));

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB Connected');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit with error
    });

mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected, attempting to reconnect...');
    setTimeout(() => {
        mongoose.connect(process.env.MONGODB_URI);
    }, 5000);
});

app.use("/auth", authRouter);
app.use("/posts", postsRouter);
app.use("/gallery", galleryRouter);


const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
