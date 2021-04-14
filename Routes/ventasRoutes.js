const express = require("express");
const router = new express.Router();

const ventasController = require("../Controller/ventasController");

router.get("/ventas/nueva-venta", ventasController.index);

router.post("/ventas/registrar-venta", ventasController.registerSale);

router.post("/ventas/detalle/:id", ventasController.saleDetail);

module.exports = router;
