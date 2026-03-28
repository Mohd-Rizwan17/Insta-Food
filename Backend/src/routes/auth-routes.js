const express = require("express");
const authController = require("../controller/auth-controller");

const router = express.Router();

//api User
router.post("/user/register", authController.registerUser);
router.post("/user/login", authController.loginUser);
router.get("/user/logout", authController.logoutUser);
router.get("/session", authController.getSession);

//api Food Partner
router.post("/food-partner/register", authController.registerFoodPartner);
router.post("/food-partner/login", authController.loginFoodPartner);
router.get("/food-partner/logout", authController.logoutFoodPartner);
router.get("/food-partner/:id", authController.getFoodPartnerById);

module.exports = router;
