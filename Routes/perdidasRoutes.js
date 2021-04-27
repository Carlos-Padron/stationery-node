const express = require("express");
const router = new express.Router();

const PerdidasController = require("../Controller/PerdidasController");
const { authViews, authRoute } = require("../Utils/Middlewares/authMiddleware");

router.get("/perdidas", authViews, PerdidasController.index);

router.post("/getLosses", authRoute, PerdidasController.searchLosses);

router.post("/registerLoss", authRoute, PerdidasController.registerLoss);

router.post("/deleteLoss", authRoute, PerdidasController.deleteLoss);

module.exports = router;
