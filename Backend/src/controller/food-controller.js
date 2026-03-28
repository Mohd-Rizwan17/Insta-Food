const foodModel = require("../models/food-models");
const savedFoodModel = require("../models/saved-food-models");
const likedFoodModel = require("../models/liked-food-models");
const storageService = require("../service/storage-service");
const { v4: uuid } = require("uuid");

async function createFood(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Food video is required" });
    }

    if (!req.body.price) {
      return res.status(400).json({ message: "Price is required" });
    }

    const fileUploadResult = await storageService.uploadfile(
      req.file.buffer,
      uuid(),
    );

    const foodItem = await foodModel.create({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      video: fileUploadResult.url,
      foodPartner: req.foodPartner._id,
    });

    res.status(201).json({
      message: "Food item created successfully",
      food: foodItem,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to create food item",
    });
  }
}

async function getFoodItems(req, res) {
  const foodItems = await foodModel.find({});
  res.status(200).json({
    message: "Food items fetched successfully",
    foodItems,
  });
}

async function toggleLikeFood(req, res) {
  try {
    const { foodId } = req.body;
    if (!foodId) {
      return res.status(400).json({ message: "foodId is required" });
    }

    const food = await foodModel.findById(foodId);
    if (!food) {
      return res.status(404).json({ message: "Food item not found" });
    }

    const existingLike = await likedFoodModel.findOne({
      user: req.user._id,
      food: foodId,
    });

    let isLiked;
    if (existingLike) {
      await existingLike.deleteOne();
      food.likeCount = Math.max(0, (food.likeCount || 0) - 1);
      isLiked = false;
    } else {
      await likedFoodModel.create({ user: req.user._id, food: foodId });
      food.likeCount = (food.likeCount || 0) + 1;
      isLiked = true;
    }

    await food.save();

    return res
      .status(200)
      .json({
        message: "Like toggled",
        like: isLiked,
        likeCount: food.likeCount,
      });
  } catch (error) {
    console.error("toggleLikeFood error:", error);
    return res
      .status(500)
      .json({ message: error.message || "Failed to toggle like" });
  }
}

async function toggleSaveFood(req, res) {
  try {
    const { foodId } = req.body;
    if (!foodId) {
      return res.status(400).json({ message: "foodId is required" });
    }

    const food = await foodModel.findById(foodId);
    if (!food) {
      return res.status(404).json({ message: "Food item not found" });
    }

    const existingSave = await savedFoodModel.findOne({
      user: req.user._id,
      food: foodId,
    });

    let isSaved;
    if (existingSave) {
      await existingSave.deleteOne();
      food.savesCount = Math.max(0, (food.savesCount || 0) - 1);
      isSaved = false;
    } else {
      await savedFoodModel.create({ user: req.user._id, food: foodId });
      food.savesCount = (food.savesCount || 0) + 1;
      isSaved = true;
    }

    await food.save();

    return res
      .status(200)
      .json({
        message: "Save toggled",
        save: isSaved,
        savesCount: food.savesCount,
      });
  } catch (error) {
    console.error("toggleSaveFood error:", error);
    return res
      .status(500)
      .json({ message: error.message || "Failed to toggle save" });
  }
}

async function getSavedFoods(req, res) {
  try {
    const savedFoods = await savedFoodModel
      .find({ user: req.user._id })
      .populate("food");
    return res
      .status(200)
      .json({ message: "Saved food items retrieved", savedFoods });
  } catch (error) {
    console.error("getSavedFoods error:", error);
    return res
      .status(500)
      .json({ message: error.message || "Failed to fetch saved foods" });
  }
}

module.exports = {
  createFood,
  getFoodItems,
  toggleLikeFood,
  toggleSaveFood,
  getSavedFoods,
};
