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
hbs.registerHelper("customIf", (val1, operator, val2, options) => {
  switch (operator) {
    case "==":
      return val1 == val2 ? options.fn(this) : options.inverse(this);
    case "!=":
      return val1 != val2 ? options.fn(this) : options.inverse(this);
    case "<":
      return val1 < v2al ? options.fn(this) : options.inverse(this);
    case ">":
      return val1 > v2al ? options.fn(this) : options.inverse(this);
    case "<=":
      return val1 <= val2 ? options.fn(this) : options.inverse(this);
    case ">=":
      return val1 >= val2 ? options.fn(this) : options.inverse(this);
    case "&&":
      return val1 && val2 ? options.fn(this) : options.inverse(this);
    case "||":
      return val1 || val2 ? options.fn(this) : options.inverse(this);
    default:
      options.inverse(this);
  }
});

//JSON config
app.use(bodyParser.json({ limit: "100mb" }));

//Sets static directory
app.use(express.static(publicDirectoryPath));

//Routes
const authRoutes = require("./Routes/authRoutes");
const dashboardhRoutes = require("./Routes/dashboardRoutes");
const marcasRoutes = require("./Routes/marcasRoutes");
const tiposArticulosRoutes = require("./Routes/tiposArticulosRoutes");
const productosRoutes = require("./Routes/productosRoutes");
const usuariosRoutes = require("./Routes/usuariosRoutes");

app.use(authRoutes);
app.use(dashboardhRoutes);
app.use(marcasRoutes);
app.use(tiposArticulosRoutes);
app.use(productosRoutes);
app.use(usuariosRoutes);

app.get("*", (req, res) => {
  res.render("notFound");
});

//Server
app.listen(PORT, () => {
  console.log("Server running " + PORT);
});
