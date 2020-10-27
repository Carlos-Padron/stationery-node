const express = require('express')
const router = new express.Router()
const User = require('../../Model/UserModel')


router.get('/productos/marcas', (req, res) => {
    res.render('productos/marcas', {
        sectionName: 'Productos',
        subsectionName: 'Marcas',
        script: 'productosMarcasClient'
    })
})

router.get('/productos/inventario', (req, res) => {
    res.render('productos/categorias', {
        sectionName: 'Productos',
        subsectionName: 'Inventario',
        script: 'productosInventario'
    })
})


module.exports = router