
const express = require("express");
const router = new express.Router();
const authController = require("../Controller/authController");
const dashboardContoller = require("../Controller/dashboardController");
const { authViews, authRoute } = require("../Utils/Middlewares/authMiddleware");

const { redirectIfAuth } = require("../Utils/Middlewares/authMiddleware");

//deafult route
router.get("/", authViews ,dashboardContoller.index);

router.get("/login", redirectIfAuth, authController.index);

router.post("/login", authController.logInUser);

router.get("/logout", authRoute, authController.logOutUser);
module.exports = router;
