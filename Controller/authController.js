const { response } = require('express')
const User = require('../Model/User')
const errorHandler = require('../Utils/Helpers/errorHandler')

const userFields = [
    'name',
    'motherSurname',
    'fatherSurname',
    'email',
    'password',
    'picture',
]

const createUser = async (req, res) => {
    console.log('create User');
    const user = new User(req.body)
    //console.log(user);

    try {
        console.log('b4 saving');
        await user.save()
        res.status(201).json({
            "error": false,
            "response": user,
        })
    } catch (error) {

       let errors = errorHandler(error)


       console.log(errors);

        res.status(400).json({
            "error": true,
            "response": errors
        });

    }

}


const logInUser = async (req, res) => {
    const email = req.body.email
    const password = req.body.password

    try {
        const user = await User.findByCredentials(email, password)
        const token = await user.generateAuthToken()

        return res.json({
            error: false,
            response: {
                user,
                token
            }
        })

    } catch (error) {
        console.log(error.message)
        return res.json({
            error: true,
            response: error.message
        })

    }

}


const dumy = (req, res)=>{
    res.send('dumy')
}

module.exports = {
    createUser,
    logInUser,
    dumy
}

