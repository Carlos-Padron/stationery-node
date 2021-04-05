const express = require("express");
const router = new express.Router();

const productosController = require("../Controller/productosController");
const { authViews, authRoute } = require("../Utils/Middlewares/authMiddleware");

router.get("/inventario/productos", authViews, productosController.index);

router.post("/getProducts", authRoute, productosController.searchProducts);

router.post("/addProduct", authRoute, productosController.createProduct);

router.post("/updateProduct", authRoute, productosController.updateProduct);

//router.post('/deleteProduct', authRoute, productosController.createProduct )

module.exports = router;
