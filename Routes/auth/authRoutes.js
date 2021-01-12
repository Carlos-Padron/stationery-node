const { Router } = require("express");
const express = require("express");
const router = new express.Router();
const authController = require("../../Controller/authController");
const dashboardContoller = require("../../Controller/dashboardController");
const { authViews } = require("../../Utils/Middlewares/authMiddleware");

const { redirect } = require("../../Utils/Middlewares/authMiddleware");

//deafult route
router.get("/", authViews ,dashboardContoller.index);

router.get("/login", redirect, authController.index);

router.post("/login", authController.logInUser);

module.exports = router;
