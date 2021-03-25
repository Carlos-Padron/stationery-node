const express = require('express')
const router = new express.Router()

const marcasController = require('../Controller/marcasController')
const { authViews, authRoute } = require("../Utils/Middlewares/authMiddleware");

router.get('/inventario/marcas', authViews ,marcasController.index)

router.post('/getBrands', authRoute, marcasController.searchBrands)

router.post('/addBrand', authRoute, marcasController.createBrand)

router.post('/updateBrand', authRoute, marcasController.updateBrand)

router.post('/deleteBrand', authRoute, marcasController.deleteBrand)

module.exports = router