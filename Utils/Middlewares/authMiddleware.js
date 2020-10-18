const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
    let authorizationHeader = req.header('Authorization')

    if (authorizationHeader) {
        const token = auhtorizationHeader.split(' ')[1]
        jwt.verify(token, process.env.SECRET_KEY, (error, userID) => {
            if (error) {
                res.status(401).json({
                    "error": true,
                    "reponse": "Usuario no autenticado"
                })
            } else {
                req.userID = userID
                next()
            }
        })
    } else {
        res.status(401).json({
            "error": true,
            "reponse": "Token no proveído"
        })
    }
}

module.exports = auth

