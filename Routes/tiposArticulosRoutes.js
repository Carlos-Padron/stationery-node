const express = require("express");
const router = new express.Router();

const tiposArticulosController = require("../Controller/tiposArticulosController");
const { authViews, authRoute } = require("../Utils/Middlewares/authMiddleware");

router.get("/inventario/tipos-articulos", authViews, tiposArticulosController.index);

router.post("/getArticleTypes", authRoute, tiposArticulosController.searchArticleType);

router.post("/addArticleType", authRoute, tiposArticulosController.createArticleType);

router.post("/updateArticleType", authRoute, tiposArticulosController.updateArticleType);

router.post("/deleteArticleType", authRoute, tiposArticulosController.deleteArticleType);

module.exports = router;
