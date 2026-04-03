const userModel = require("../models/user-models");
const foodPartnerModel = require("../models/foodpartner-models");
const foodModel = require("../models/food-models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function registerUser(req, res) {
  try {
    const { fullName, email, password, phone } = req.body;

    if (!fullName || !email || !password || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const isUserAlreadyExists = await userModel.findOne({ email });

    if (isUserAlreadyExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      fullName,
      email,
      password: hashedPassword,
      phone,
    });

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
    );
    res.cookie("token", token);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("registerUser error:", error);
    if (error.code === 11000) {
      return res.status(409).json({ message: "User already exists" });
    }
    res.status(500).json({ message: error.message || "Registration failed" });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    console.log("token:", token);
    // res.cookie("token", token, { httpOnly: true });
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    res.status(200).json({
      message: "User logged in successfully",
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    console.error("loginUser error:", error);
    res.status(500).json({ message: error.message || "Login failed" });
  }
}

function logoutUser(req, res) {
  // res.clearCookie("token");
  res.clearCookie("userToken"); // 🔥 FIX
  res.status(200).json({ message: "User logged out successfully" });
}

async function registerFoodPartner(req, res) {
  try {
    const { name, email, password, contact, ownerName, address } = req.body;

    if (!name || !email || !password || !contact || !ownerName || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const isAccountAlreadyExists = await foodPartnerModel.findOne({ email });

    if (isAccountAlreadyExists) {
      return res.status(400).json({ message: "Account already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const foodPartner = await foodPartnerModel.create({
      name,
      email,
      password: hashedPassword,
      contact,
      ownerName,
      address,
    });

    const token = jwt.sign(
      {
        id: foodPartner._id,
      },
      process.env.JWT_SECRET,
    );

    res.cookie("token", token);

    res.status(201).json({
      message: "Food partner registered successfully",
      foodPartner: {
        _id: foodPartner._id,
        email: foodPartner.email,
        name: foodPartner.name,
        ownerName: foodPartner.ownerName,
        contact: foodPartner.contact,
        address: foodPartner.address,
      },
    });
  } catch (error) {
    console.error("registerFoodPartner error:", error);
    if (error.code === 11000) {
      return res.status(409).json({ message: "Food partner already exists" });
    }
    res.status(500).json({ message: error.message || "Registration failed" });
  }
}

async function loginFoodPartner(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const foodPartner = await foodPartnerModel.findOne({ email });

    if (!foodPartner) {
      return res.status(400).json({ message: "Food partner not found" });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      foodPartner.password,
    );

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      {
        id: foodPartner._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    console.log("token:", token);

    // res.cookie("token", token, { httpOnly: true });
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    res.status(200).json({
      message: "Food partner logged in successfully",
      foodPartner: {
        _id: foodPartner._id,
        email: foodPartner.email,
        name: foodPartner.name,
      },
    });
  } catch (error) {
    console.error("loginFoodPartner error:", error);
    res.status(500).json({ message: error.message || "Login failed" });
  }
}

async function getSession(req, res) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(200).json({
      authenticated: false,
      role: null,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.id);
    if (user) {
      return res.status(200).json({
        authenticated: true,
        role: "user",
        user: {
          _id: user._id,
          email: user.email,
          fullName: user.fullName,
        },
      });
    }

    const foodPartner = await foodPartnerModel.findById(decoded.id);
    if (foodPartner) {
      return res.status(200).json({
        authenticated: true,
        role: "food-partner",
        foodPartner: {
          _id: foodPartner._id,
          email: foodPartner.email,
          name: foodPartner.name,
        },
      });
    }

    return res.status(200).json({
      authenticated: false,
      role: null,
    });
  } catch (error) {
    return res.status(200).json({
      authenticated: false,
      role: null,
    });
  }
}

async function getFoodPartnerById(req, res) {
  try {
    const { id } = req.params;
    console.log("getFoodPartnerById called with id", id);

    const foodPartner = await foodPartnerModel.findById(id);
    if (!foodPartner) {
      console.warn("Food partner not found for id", id);
      return res.status(404).json({ message: "Food partner not found" });
    }

    const foodItems = await foodModel.find({ foodPartner: id });

    console.log(
      "Food partner found",
      foodPartner._id,
      "foodItems",
      foodItems.length,
    );

    res.status(200).json({
      message: "Food partner profile fetched successfully",
      foodPartner: {
        _id: foodPartner._id,
        name: foodPartner.name,
        email: foodPartner.email,
        ownerName: foodPartner.ownerName,
        contact: foodPartner.contact,
        address: foodPartner.address,
        totalMeals: foodItems.length,
        customersServed: 0,
      },
      foodItems,
    });
  } catch (error) {
    console.error("getFoodPartnerById error:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to fetch profile" });
  }
}

function logoutFoodPartner(req, res) {
  // res.clearCookie("token");
  res.clearCookie("foodPartnerToken"); // 🔥 FIX
  res.status(200).json({ message: "Food partner logged out successfully" });
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getSession,
  registerFoodPartner,
  loginFoodPartner,
  logoutFoodPartner,
  getFoodPartnerById,
};
