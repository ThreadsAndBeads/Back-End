const express = require("express");
const cors = require("cors");
const AppError = require("./utils/appError");
const userRoutes = require("./Routes/UserRoutes");
const productRoutes = require("./Routes/ProductRoutes");
const cartRoutes = require("./Routes/CartRoutes");
const workshopRoutes = require("./Routes/WorkshopRoutes");
const orderRoutes = require("./Routes/OrderRoutes");
const favouriteRoutes = require("./Routes/FavouriteRoutes");
const paymentRoutes = require("./Routes/PaymentRoutes");
const globalErrorHandler = require("./Controllers/ErrorController");
const { storage } = require("./storage/storage");
const multer = require("multer");
const upload = multer({ storage });

const app = express();
const passport = require("passport");
const session = require("express-session");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// app.use(cors());
app.use(express.json());
require("./utils/facebook");




// socketModule.init(server);
app.use(cors({ origin: "*" }));
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
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/workshops", workshopRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/favourites", favouriteRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.all("*", (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

module.exports = app;