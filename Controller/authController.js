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

const logIn = async (req, res) => {

    const user = new User(req.body)

    try {
        await user.save()
        //TODO: Implement JWT
        res.status(201).json({
            "error": false,
            "response": user,
        })
    } catch (error) {

        let errors = errorHandler(error, userFields)

        res.status(400).json({
            "error": true,
            "response": errors//.errors['password'].message,
        });

    }



}



module.exports = {
    logIn
}

