const express = require('express')
const router = new express.Router()

const productosController = require('../Controller/productosController')

router.get('/inventario/productos', productosController.index )

module.exports = router