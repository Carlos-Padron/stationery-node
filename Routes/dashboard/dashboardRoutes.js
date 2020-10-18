const express = require('express')
const router = new express.Router()

router.get('/',(req, res)=>{
    res.render('dashboard',{
        name: 'Tablero'
    })
})

module.exports = router