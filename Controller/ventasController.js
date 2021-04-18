const errorHandler = require("../Utils/Helpers/errorHandler");
const Sale = require("../Model/SaleModel");
const Brand = require("../Model/BrandModel");
const ArticleType = require("../Model/ArticleType");
const Product = require("../Model/ProductModel");

//Nueva Venta
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

    for (const prod of req.body.saleDetail) {
      let product = await Product.findById(prod.productID).select(
        "_id name price quantity"
      );

      if (!product) {
        outOfStock.push(
          `No se encontró ${prod.productName} en el catálogo de productos.`
        );
      } else {
        if (prod.quantity > product.quantity) {
          outOfStock.push(
            `La cantidad agregada de ${prod.productName} supera a la cantidad de stock del inventario.`
          );
        } else {
          saleDetails.push({
            productID: prod.productID,
            quantity: prod.quantity,
            unitPrice: prod.unitPrice,
          });
        }
      }
    }

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
      discount: req.body.discount != null ? req.body.discount : 0,
      madeBy: req.user._id,
      saleDetail: saleDetails,
    });

    await sale.save();

    for (const prod of req.body.saleDetail) {
      console.log({ _id: prod.productID });

      await Product.findOneAndUpdate(
        { _id: prod.productID },
        { $inc: { quantity: -prod.quantity } }
      ).exec();
    }

    res.json({
      error: false,
      response: sale._id,
      message: "Venta registrada",
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

// Historial de ventas
const saleHistory = (req, res) => {
  res.render("ventas/historialVentas", {
    sectionName: "Historial de ventas",
    script: "historialVentasClient",
    activeMenu: "VNTS",
    activeSubmenu: "HSVNTS",
  });
};

const searchSales = async (req, res) => {
  const { fechaInicio, fechaFin, cancelled } = req.body;
  console.log(req.body);
  console.log("fechaInicio", fechaInicio);
  console.log("fechaFin", fechaFin);
  try {
    let sales = await Sale.find({
      date: { $gte: fechaInicio, $lte: fechaFin },
    }).sort({ date: "asc" });

    res.json({
      error: false,
      message: null,
      response: sales,
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

const saleDetail = async (req, res) => {
  try {
    res.render("ventas/detalleVenta", {
      sectionName: "Detalle de la venta",
      script: "detalleVentaClient",
      activeMenu: "VNTS",
      activeSubmenu: "HSVNTS",
    });
  } catch (error) {
    res.send("Ocurrió un error al mostrar la página.");
  }
};

module.exports = {
  index,
  registerSale,
  saleHistory,
  searchSales,
  saleDetail,
};
