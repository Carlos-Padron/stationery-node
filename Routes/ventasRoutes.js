const express = require("express");
const router = new express.Router();

const ventasController = require("../Controller/ventasController");
const { authViews, authRoute } = require("../Utils/Middlewares/authMiddleware");

router.get("/ventas/nueva-venta", authViews, ventasController.index);

router.post("/ventas/registrar-venta",authRoute, ventasController.registerSale);

router.get("/ventas/detalle/:id", authViews, ventasController.saleDetail);

module.exports = router;
