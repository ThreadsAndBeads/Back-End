const express = require("express");
const authRoutes = require("./Routes/UserRoutes");
const productRoutes = require("./Routes/ProductRoutes");
const app = express();
const passport = require("passport");
const dotenv = require("dotenv");
const session = require("express-session");
dotenv.config({ path: "./config.env" });
app.use(express.json());
require("./utils/facebook");
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
// signup with facebook
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: "your-session-secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.listen(process.env.PORT, () => {
  console.log("http://localhost:" + process.env.PORT);
});

app.use(authRoutes);
app.use(productRoutes);
