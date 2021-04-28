const express = require("express");
const router = new express.Router();

const cotizacionController = require("../Controller/cotizacionController");
const { authViews, authRoute } = require("../Utils/Middlewares/authMiddleware");

//Nueva Venta
router.get("/cotizaciones", authViews, cotizacionController.index);
router.post("/getQuotes", authRoute, cotizacionController.searchQuotes);

router.get("/cotizaciones/nueva-cotizacion", authViews, cotizacionController.newQuote);





module.exports = router;
