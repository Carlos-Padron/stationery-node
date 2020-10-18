const User = require('../Model/UserModel')
const errorHandler = require('../Utils/Helpers/errorHandler')


const createUser = async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        res.status(201).json({
            "error": false,
            "response": 'Usuario creado correctamente.',
        })

    } catch (error) {

        //console.log(error);
       let errors = errorHandler(error)
        res.status(400).json({
            "error": true,
            "response": errors
        });

    }

}


const logInUser = async (req, res) => {
    const email = req.body.email
    const password = req.body.password

    console.log(req.body);

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

