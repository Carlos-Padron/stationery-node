const express = require("express");
const router = new express.Router();

const serviciosController = require("../Controller/serviciosController");
const { authViews, authRoute } = require("../Utils/Middlewares/authMiddleware");

router.get("/servicios", authViews, serviciosController.index);

router.post("/searchServices", authRoute, serviciosController.searchServices);

router.post("/addSeervice", authRoute, serviciosController.createService);

router.post("/updateService", authRoute, serviciosController.updateService);

router.post("/deleteSerivce", authRoute, serviciosController.deleteService);

module.exports = router;
