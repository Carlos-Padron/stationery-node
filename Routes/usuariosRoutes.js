const express = require('express')
const router = new express.Router()

const usuarioController = require('../Controller/usuarioController')

router.get('/usuarios', usuarioController.index)

router.post('/getUsers', usuarioController.searchUsers)

router.post('/addUser',usuarioController.createUser)

router.post('/updateUser',usuarioController.updateUser)

router.post('/deleteUser',usuarioController.deleteUser)

module.exports = router
