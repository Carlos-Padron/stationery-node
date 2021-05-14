const express = require("express");
const router = new express.Router();

const productosController = require("../Controller/productosController");
const { authViews, authRoute } = require("../Utils/Middlewares/authMiddleware");
const {
  isAdminForRoutes,
} = require("../Utils/Middlewares/permissionMiddleware");

router.get("/inventario/productos", authViews, productosController.index);

router.post("/getProducts", authRoute, productosController.searchProducts);

router.post("/addProduct", authRoute, productosController.createProduct);

router.post("/showProduct", authRoute, productosController.showProduct);

router.post("/updateProduct", authRoute, productosController.updateProduct);

router.post("/deleteProduct", authRoute, productosController.deleteProduct);

router.post("/enableProduct", authRoute, productosController.enableProduct);

router.post(
  "/getProductsWithStock",
  authRoute,
  productosController.searchProductsWithStock
);

router.post(
  "/getProductsForCombo",
  authRoute,
  productosController.getProductsForCombo
);

router.post(
  "/printAllProducts",
  authRoute,
  productosController.printProductsReport
);

router.post(
  "/printLowStockProducts",
  [authRoute, isAdminForRoutes],
  productosController.printLowStockProductsReport
);

module.exports = router;
