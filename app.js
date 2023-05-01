const express = require("express");
const authRoutes = require('./Routes/UserRoutes');
const app = express();
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
app.use(express.json());
const mongoose = require("mongoose");
const DB_URL = process.env.DATABASE_URL;

mongoose
    .connect(DB_URL, { useNewUrlParser: true })
    .then((res) => {
        console.log("Database connected successfully");
    })
    .catch((err) => {
        console.error("Connection error:", err);
    });
    
app.listen(process.env.PORT, () => {
    console.log("http://localhost:" + process.env.PORT);
});

app.use(authRoutes);