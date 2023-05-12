const express = require("express");
const userRoutes = require("./Routes/UserRoutes");
const productRoutes = require("./Routes/ProductRoutes");
const cartRoutes = require("./Routes/CartRoutes");
const workshopRoutes = require("./Routes/WorkshopRoutes");
const orderRoutes = require("./Routes/OrderRoutes");
const globalErrorHandler = require("./Controllers/ErrorController");
const AppError = require("./utils/appError");
const { storage } = require("./storage/storage");
const multer = require("multer");
const upload = multer({ storage });
const app = express();
const passport = require("passport");
const dotenv = require("dotenv");
const cors = require("cors");
const session = require("express-session");
dotenv.config({ path: "./config.env" });

app.use(cors());
app.use(express.json());
require("./utils/facebook");
require("./utils/googlesignup");
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
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/workshops", workshopRoutes);
app.use("/api/v1/order", orderRoutes);

app.all("*", (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl}`, 404));
});
app.use(globalErrorHandler);

app.listen(process.env.PORT, () => {
  console.log("http://localhost:" + process.env.PORT);
});
