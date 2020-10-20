const jwt          = require('jsonwebtoken')
const User         = require('../../Model/UserModel')
const { redisGet } = require('../Helpers/redisHelper')



const authViews = async (req, res, next) => {
    try {
        console.log('en middleware');

        if (req.sessionID) {

            let cookie = await redisGet(`sess:${req.sessionID}`)

            if (!cookie) {
                return res.redirect('/login?data=d')
            }

            console.log(cookie);
            let token = JSON.parse(cookie).key

            let userID = jwt.verify(token, process.env.SECRET_KEY)
            let user = await User.findById(userID)

            if (user) {
                req.user = user
                next()
            } else {
                return res.redirect('/login?code=403')
            }
        } else {
            return res.redirect('/login?code=401')
        }
    } catch (error) {
        return res.redirect('/login?code=500')
    }
}

module.exports = {
    authViews
}

