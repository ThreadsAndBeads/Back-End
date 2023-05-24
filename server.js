const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");
const DB_URL = process.env.DATABASE_URL;
const DB = process.env.DATABASE;

mongoose
    .connect(DB, {
    useNewUrlParser: true,
    })
    .then(() => {
    console.log("DB connection successful");
    })
    .catch((err) => {
    console.error("Connection error:", err);
    });

const server = app.listen(process.env.PORT, () => {
    console.log("http://localhost:" + process.env.PORT);
});
