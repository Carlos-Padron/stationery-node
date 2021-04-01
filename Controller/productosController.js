const errorHandler = require("../Utils/Helpers/errorHandler");
const Product = require("../Model/ProductModel");
const Brand = require("../Model/BrandModel");
const ArticleType = require("../Model/ArticleType");

//!Bajó la mercancía
//!Devolucion de mercanía
//!Périda de mercancía

const index = async (req, res) => {
  try {
    let brands = await Brand.find({ disabled: false });
    let articleTypes = await ArticleType.find({ disabled: false });

    res.render("inventario/productos", {
      sectionName: "Productos",
      script: "productosClient",
      activeMenu: "INVTRO",
      activeSubmenu: "PRDCTS",
      brands,
      articleTypes,
    });
  } catch (error) {
    res.send("Ocurrió un error al mostrar la página.");
  }
};

const createProduct = async (req, res) => {
  delete req.body._id;

  let productBody = req.body;
  productBody.history = [
    {
      date: new Date(),
      quantity: req.body.quantity,
      action: "add",
      description: "Se ingresó de mercancia",
      madeBy: req.user._id,
    },
  ];

  try {
    let product = Product(productBody);
    await product.save();

    res.json({
      error: false,
      message: "El producto se agregó correctamente",
      response: null,
    });
  } catch (error) {
    let errors = errorHandler(error);

    if (errors.length === 0) {
      res.json({
        error: true,
        message: error.message,
        response: null,
      });
    } else {
      res.json({
        error: true,
        message: errors,
        response: null,
      });
    }
  }
};

module.exports = {
  index,
  createProduct,
};
