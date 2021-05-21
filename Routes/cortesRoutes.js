const express = require("express");
const router = new express.Router();

const cortesController = require("../Controller/cortesController");
const { authViews, authRoute } = require("../Utils/Middlewares/authMiddleware");

router.get("/cortes", authViews, cortesController.index);

router.post("/searchCahsOuts", authRoute, cortesController.searchCashOuts);

router.post("/addCashOut", authRoute, cortesController.registerCashOut);

router.post("/updateCashOut", authRoute, cortesController.updateCashOut);

router.post("/printCashOuts", authRoute, cortesController.printCashOut);

module.exports = router;
