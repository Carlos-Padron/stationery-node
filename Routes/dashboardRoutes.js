const express = require("express");
const router = new express.Router();
const dashboardContoller = require("../../Controller/dashboardController");

const { authViews } = require("../../Utils/Middlewares/authMiddleware");

router.get("/dashboard", authViews, dashboardContoller.index);

module.exports = router;
