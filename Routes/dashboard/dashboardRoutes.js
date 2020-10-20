const express = require('express')
const router = new express.Router()

const { authViews } = require('../../Utils/Middlewares/authMiddleware')


router.get('/dashboard',authViews ,async (req, res)=>{

    res.render('dashboard',{
        name: 'Tablero'
    })    
})

module.exports = router