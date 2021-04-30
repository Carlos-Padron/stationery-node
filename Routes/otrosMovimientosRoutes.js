const express = require("express");
const router = new express.Router();

const otrosMovimientosController = require("../Controller/otrosMovimientosController");
const { authViews, authRoute } = require("../Utils/Middlewares/authMiddleware");

router.get("/otrosMovimientos", authViews, otrosMovimientosController.index);

router.post("/searchOtherMovements", authRoute, otrosMovimientosController.searchOtherMovements);

router.post("/addOtherMovement", authRoute, otrosMovimientosController.createOtherMovement);

router.post("/updateOtherMovement", authRoute, otrosMovimientosController.updateOtherMovement);

router.post("/deleteOtherMovement", authRoute, otrosMovimientosController.deleteOtherMovement);

module.exports = router;
