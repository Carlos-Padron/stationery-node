const express = require("express");
const router = new express.Router();

const tiposArticulosController = require("../Controller/tiposArticulosController");
const { authViews, authRoute } = require("../Utils/Middlewares/authMiddleware");

router.get("/inventario/tipos-articulos", tiposArticulosController.index);

module.exports = router;
