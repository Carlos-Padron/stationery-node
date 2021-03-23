require("dotenv").config();
require("./DB/mongoose");

const express = require("express");
const bodyParser = require("body-parser");
const hbs = require("hbs");
const layouts = require("handlebars-layouts");
const path = require("path");
const { sessionObj } = require("./Utils/Helpers/redisHelper");

const app = express();
const PORT = process.env.PORT || 3000;

//Express config
const publicDirectoryPath = path.join(__dirname, "Public");
const viewsPath = path.join(__dirname, "View/layouts");
const partialsPath = path.join(__dirname, "View/partials");

//Session config
app.use(sessionObj);
  
//Sets hbs view engine ,views location, layout helper and partials
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerHelper(layouts(hbs.handlebars));
hbs.registerPartials(partialsPath);

//JSON config
app.use(bodyParser.json());

//Sets static directory
app.use(express.static(publicDirectoryPath));

//Routes
const authRoutes = require("./Routes/authRoutes");
const dashboardhRoutes = require("./Routes/dashboardRoutes");
const marcasRoutes = require('./Routes/marcasRoutes')
const usuariosRoutes = require("./Routes/usuariosRoutes");

app.use(authRoutes);
app.use(dashboardhRoutes);
app.use(marcasRoutes);
app.use(usuariosRoutes);


//Server
app.listen(PORT, () => {
  console.log("Server running " + PORT);
});
