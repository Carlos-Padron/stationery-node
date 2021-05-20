const express = require("express");
const router = new express.Router();

const ventasController = require("../Controller/ventasController");
const { authViews, authRoute } = require("../Utils/Middlewares/authMiddleware");

//Nueva Venta
router.get("/ventas/nueva-venta", authViews, ventasController.index);

router.post("/registrar-venta", authRoute, ventasController.registerSale);

//Historial de ventas
router.get("/ventas/historialVentas", authViews, ventasController.saleHistory);
router.post("/getSales", authRoute, ventasController.searchSales);

//Detalle venta
router.get("/ventas/detalle/:id", authViews, ventasController.saleDetail);

//Cancelar venta
router.post("/cancelSale", authRoute, ventasController.cancelSale);

//Cambio de producto o devolucion
router.get(
  "/ventas/cambio-devolucion/:id",
  authViews,
  ventasController.editSale
);
router.post("/actualizar-venta", authRoute, ventasController.updateSale);

//Reportes
router.post("/printSales", authRoute, ventasController.printSalesDone);
router.post("/printCancledSales", authRoute, ventasController.printCanceledSales);
router.post("/printSaleDetail", authRoute, ventasController.printSaleDetail);

module.exports = router;
