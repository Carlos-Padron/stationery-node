const express = require("express");
const router = new express.Router();

const ventasController = require("../Controller/ventasController");

router.get("/ventas/nueva-venta", ventasController.index);

module.exports = router;
