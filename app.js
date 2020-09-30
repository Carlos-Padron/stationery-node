const express   = require('express')
const hbs       = require('hbs');
const layouts   = require('handlebars-layouts');
const path      = require('path')

const app       = express()
const PORT      = process.env.PORT || 3000

//Express config
const publicDirectoryPath   = path.join(__dirname, 'Public')
const viewsPath             = path.join(__dirname, 'View/layouts')
const partialsPath          = path.join(__dirname, 'View/partials')

//Routes imports
const authRoutes = require('./Routes/auth/auth')
const dashboardhRoutes = require('./Routes/dashboard/dashboard')

//Sets hbs view engine ,views location, layout helper and partials
app.set('view engine','hbs')
app.set('views', viewsPath)
hbs.registerHelper(layouts(hbs.handlebars))
hbs.registerPartials(partialsPath)

//Sets static directory
app.use(express.static(publicDirectoryPath))

//Routes
app.use(authRoutes)
app.use(dashboardhRoutes)



app.listen(PORT,()=>{
    console.log('Server running');
})