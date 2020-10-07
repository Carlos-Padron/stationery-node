const express = require('express');
const router = new express.Router();
const authController = require('../../Controller/authController')

router.post('/login', authController.logIn)


router.get('/login',(req, res)=>{
    res.render('login',{
        script: 'loginClient'
    })
})


module.exports = router