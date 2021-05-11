const express = require("express");
const router = new express.Router();

const usuarioController = require("../Controller/usuarioController");
const { authViews, authRoute } = require("../Utils/Middlewares/authMiddleware");
const { isAdminForViews , isAdminForRoutes} = require("../Utils/Middlewares/permissionMiddleware");

router.get("/usuarios", [authViews, isAdminForViews], usuarioController.index);

router.get("/perfil", authViews, usuarioController.profile);

router.post("/getUsers", [authRoute, isAdminForRoutes], usuarioController.searchUsers);

router.post("/addUser", [authRoute, isAdminForRoutes], usuarioController.createUser);

router.post("/updateUser", authRoute, usuarioController.updateUser);

router.post("/enableUser", [authRoute, isAdminForRoutes], usuarioController.enableUser);

router.post("/deleteUser", [authRoute, isAdminForRoutes], usuarioController.deleteUser);

module.exports = router;
