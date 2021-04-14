const errorHandler = require("../Utils/Helpers/errorHandler");
const Sale = require("../Model/ProductModel");
const Brand = require("../Model/BrandModel");
const ArticleType = require("../Model/ArticleType");
const Product = require("../Model/ProductModel");

const index = async (req, res) => {
  try {
    let brands = await Brand.find({ disabled: false }).sort({ name: "asc" });
    let articleTypes = await ArticleType.find({ disabled: false }).sort({
      name: "asc",
    });

    res.render("ventas/nuevaVenta", {
      sectionName: "Nueva venta",
      script: "nuevaVentaClient",
      activeMenu: "VNTS",
      activeSubmenu: "NVNTA",
      brands,
      articleTypes,
    });
  } catch (error) {
    res.send("Ocurrió un error al mostrar la página.");
  }
};

const registerSale = async (req, res) => {
  try {
    let saleDetails = [];
    let outOfStock = [];

    req.body.saleDetails.forEach(async (elem) => {
      let product = await Product.findById(elem.productID);

      if (!product) {
        outOfStock.push(
          `No se encontró ${elem.productName} en el catálogo de productos.`
        );
      } else {
        if (elem.quantity > product.quantity) {
          outOfStock.push(
            `La cantidad agregada de ${elem.productName} supera a la cantidad de stock del inventario.`
          );
        } else {
          saleDetails.push({
            productID: elem.productID,
            quantity: elem.quantity,
            unitPrice: elem.unitPrice,
          });
        }
      }
    });

    if (outOfStock.length > 0) {
      return res.json({
        error: true,
        message: outOfStock,
        response: null,
      });
    }

    let sale = await Sale({
      concept: req.body.concept,
      date: new Date(),
      total: req.body.total,
      discount: req.body.discount,
      madeBy: req.user._id,
      saleDetail: saleDetails,
    });

    await sale.save();

    res.json({
      error: false,
      response: sale._id,
      message: null,
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

const saleDetail = async (req, res) => {};

module.exports = {
  index,
  registerSale,
  saleDetail,
};
