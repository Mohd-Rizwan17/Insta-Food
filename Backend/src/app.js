const express = require("express");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth-routes");
const foodRoutes = require("./routes/food-routes");
const cors = require("cors");

const app = express();

app.set("trust proxy", 1);

app.use(cookieParser());
app.use(express.json());
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   }),
// );
app.use(
  cors({
    origin: "https://insta-food-kft1.onrender.com",
    credentials: true,
  }),
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/auth", authRoutes);
app.use("/api/food", foodRoutes);

// Global error handler (catch-all errors)
app.use((err, req, res, next) => {
  console.error("Unexpected error:", err);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal server error" });
});

module.exports = app;
