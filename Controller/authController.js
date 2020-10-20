const User = require('../Model/UserModel')
const errorHandler = require('../Utils/Helpers/errorHandler')


const createUser = async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        res.status(201).json({
            "error": false,
            "message": 'Usuario creado correctamente.',
            "response": null,
        })

    } catch (error) {

       let errors = errorHandler(error)
        res.status(400).json({
            "error": true,
            "message": errors,
            "response": null
        });

    }

}


const logInUser = async (req, res) => {
    const {email, password} = req.body

    try {
        const user = await User.findByCredentials(email, password)
        const token = await user.generateAuthToken()

        req.session.key = token

        console.log(req.session);
        return res.json({
            error: false,
            message: "Acceso correcto.",
            response: {
                user,
                token
            }
        })

    } catch (error) {
        console.log(error.message)
        return res.json({
            error: true,
            message: error.message,
            response: null
        })

    }

}


module.exports = {
    createUser,
    logInUser
}

