const redis         = require('redis')
const session       = require('express-session')
const redisStore    = require('connect-redis')(session)
const redisClient   = redis.createClient()
const { promisify } = require('util')

const redisGet = promisify(redisClient.get).bind(redisClient)

const sessionObj = session({
    secret: process.env.REDIS_SECRET,
    store: new redisStore({host:"localhost", port: 6379, client: redisClient, ttl:260}),
    saveUninitialized: false,
    resave: false,
    name: "sessionID",
    cookie:{
        secure: false,
        httpOnly: false,
       // maxAge: 
    }
})

module.exports = {
    sessionObj,
    redisGet
}