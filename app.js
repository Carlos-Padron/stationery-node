require('dotenv').config()
require('./DB/mongoose')
const express    = require('express')
const redis      = require('redis')
const bodyParser = require('body-parser')
const hbs        = require('hbs');
const layouts    = require('handlebars-layouts');
const path       = require('path')
const session    = require('express-session')
const redisStore = require('connect-redis')(session)

const app        = express()
const PORT       = process.env.PORT || 3000

//Express config
const publicDirectoryPath   = path.join(__dirname, 'Public')
const viewsPath             = path.join(__dirname, 'View/layouts')
const partialsPath          = path.join(__dirname, 'View/partials')

//Session config
const redisClient = redis.createClient()
app.use(session({
    secret: process.env.REDIS_SECRET,
    store: new redisStore({host:"localhost", port: 6379, client: redisClient, ttl:260}),
    saveUninitialized: false,
    resave: false,
}))

//Routes imports
const authRoutes        =  require('./Routes/auth/authRoutes')
const dashboardhRoutes  =  require('./Routes/dashboard/dashboardRoutes')
const productosRoutes   =  require('./Routes/productos/productosRoutes');

//Sets hbs view engine ,views location, layout helper and partials
app.set('view engine','hbs')
app.set('views', viewsPath)
hbs.registerHelper(layouts(hbs.handlebars))
hbs.registerPartials(partialsPath)

//JSON config
app.use(bodyParser.json())

//Sets static directory
app.use(express.static(publicDirectoryPath))

//Routes
app.use(authRoutes)
app.use(dashboardhRoutes)
app.use(productosRoutes)


app.listen(PORT,()=>{
    console.log('Server running');
})