const express = require("express");
const router = new express.Router();

const cotizacionController = require("../Controller/cotizacionController");
const { authViews, authRoute } = require("../Utils/Middlewares/authMiddleware");

//Nueva Venta
router.get("/cotizaciones", authViews, cotizacionController.index);
router.post("/registrar-cotizacion", authRoute, cotizacionController.registerQuote);
router.get("/cotizaciones/nueva-cotizacion", authViews, cotizacionController.newQuote);

router.post("/getQuotes", authRoute, cotizacionController.searchQuotes);


//Detalle Cotizacion
router.get("/cotizaciones/detalle/:id", authViews, cotizacionController.quoteDetail);

//Editar Cotizacion
router.get("/cotizaciones/editar/:id", authViews, cotizacionController.editQuote);

//Actualizar Cotizacion
router.post("/actualizar-cotizacion", authRoute, cotizacionController.updateQuote);

//Actualizar y vender Cotizacion
router.post("/vender-cotizacion", authRoute, cotizacionController.sellQuote);

//Reporte
router.post("/printQuoteDetail", authRoute, cotizacionController.printQuote);




module.exports = router;
