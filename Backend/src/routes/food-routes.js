const express = require("express");
const foodController = require("../controller/food-controller");
const authMiddleware = require("../middleware/auth-middleware");
const router = express.Router();
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });
const uploadFoodVideo = (req, res, next) => {
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "mama", maxCount: 1 },
  ])(req, res, (error) => {
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    req.file = req.files?.video?.[0] || req.files?.mama?.[0];
    next();
  });
};

router.post(
  "/",
  authMiddleware.authFoodPartnerMiddleware,
  uploadFoodVideo,
  foodController.createFood,
);

router.post(
  "/like",
  authMiddleware.authUserMiddleware,
  foodController.toggleLikeFood,
);

router.get(
  "/save",
  authMiddleware.authUserMiddleware,
  foodController.getSavedFoods,
);

router.post(
  "/save",
  authMiddleware.authUserMiddleware,
  foodController.toggleSaveFood,
);

router.get("/", authMiddleware.authUserMiddleware, foodController.getFoodItems);

module.exports = router;
