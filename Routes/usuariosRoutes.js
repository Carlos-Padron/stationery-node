const express = require("express");
const router = new express.Router();

const usuarioController = require("../Controller/usuarioController");
const { authViews, authRoute } = require("../Utils/Middlewares/authMiddleware");

router.get("/usuarios", authViews, usuarioController.index);

router.post("/getUsers", authRoute, usuarioController.searchUsers);

router.post("/addUser", authRoute, usuarioController.createUser);

router.post("/updateUser", authRoute, usuarioController.updateUser);

router.post("/deleteUser", authRoute, usuarioController.deleteUser);

module.exports = router;