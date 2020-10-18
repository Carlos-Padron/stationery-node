const express = require('express')
const router = new express.Router()


router.get('/productos/categorias', (req, res) => {
    res.render('productos/categorias', {
        sectionName: 'Productos',
        subsectionName: 'Categorías',
        script: 'productosCategoriasClient'
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