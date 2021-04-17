const express = require("express");
const router = new express.Router();

const ventasController = require("../Controller/ventasController");
const { authViews, authRoute } = require("../Utils/Middlewares/authMiddleware");

//Nueva Venta
router.get("/ventas/nueva-venta", authViews, ventasController.index);

router.post("/ventas/registrar-venta",authRoute, ventasController.registerSale);

//Historial de ventas
router.get("/ventas/historialVentas", authViews, ventasController.saleHistory);


//
router.get("/ventas/detalle/:id", authViews, ventasController.saleDetail);

module.exports = router;
