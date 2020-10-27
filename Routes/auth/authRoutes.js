const express = require('express');
const router = new express.Router();
const authController = require('../../Controller/authController')
const { redirect } = require('../../Utils/Middlewares/authMiddleware')

router.get('/login', redirect, authController.index)

router.post('/login', authController.logInUser)


       

module.exports = router