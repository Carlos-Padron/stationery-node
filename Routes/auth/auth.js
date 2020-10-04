const exxpress = require('express')
const express = require('express');
const router = new express.Router();

router.get('/login',(req, res)=>{
    res.render('login',{
        script: 'loginClient'
    })
})


module.exports = router