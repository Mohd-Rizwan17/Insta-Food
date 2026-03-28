const mongoose = require("mongoose");

function connectDB() {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log("MongoDB connected ✅"))
    .catch((error) => console.log(error));
}

module.exports = connectDB;
