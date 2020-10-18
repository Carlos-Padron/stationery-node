const express = require('express');
const router = new express.Router();
const authController = require('../../Controller/authController')

router.post('/usuarios/nuevoUsuario', authController.createUser)

router.post('/login', authController.logInUser)


router.get('/login',(req, res)=>{
    res.render('login',{
        script: 'loginClient'
    })
})

       

module.exports = router