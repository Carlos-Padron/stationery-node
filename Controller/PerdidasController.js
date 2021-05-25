const LossModel = require("../Model/LossModel");
const ProductModel = require("../Model/ProductModel");
const BrandModel = require("../Model/BrandModel");
const ArticleTypeModel = require("../Model/ArticleType");
const errorHandler = require("../Utils/Helpers/errorHandler");
const productModel = require("../Model/ProductModel");
const moment = require("moment-timezone")

const index = async (req, res) => {
  try {
    let brands = await BrandModel.find({ disabled: false }).sort({
      name: "asc",
    });
    let articleTypes = await ArticleTypeModel.find({ disabled: false }).sort({
      name: "asc",
    });

    res.render("perdidas/perdidas", {
      sectionName: "Pérdidas",
      script: "perdidasClient",
      activeMenu: "PRDS",
      brands,
      articleTypes,
    });
  } catch (error) {
    res.render("notFound");
  }
};

const registerLoss = async (req, res) => {
  const { product: _id, quantity } = req.body;
  try {
    let product = await ProductModel.findById(_id);

    if (!product) {
      res.json({
        error: true,
        message: "No se encontró el producto solicitado.",
        response: null,
      });
      return;
    }

    if (quantity > product.quantity) {
      res.json({
        error: true,
        message:
          "Las pérdidas no pueden se mayor a la cantidad total de invetario del producto.",
        response: null,
      });
      return;
    }

    let loss = LossModel({
      productID: _id,
      quantity,
      unitPrice: product.price,
      madeBy: req.user._id,
      date: new Date(moment.tz("America/Mexico_City").format().split("T")[0]),
    });

    await loss.save();
    //quitar producto
    product.quantity = product.quantity - quantity;
    product.history.push({
      date: new Date(moment.tz("America/Mexico_City").format().split("T")[0]),
      quantity: quantity,
      action: "subtract",
      description: "Pérdida de mercancia",
      madeBy: req.user._id,
    });

    await product.save();

    let productHistoryID = product.history[product.history.length - 1]._id;
    loss.historyID = productHistoryID;

    await loss.save();

    res.json({
      error: false,
      message: "La pérdida se agregó correctamente.",
      response: null,
    });
  } catch (error) {
    let errors = errorHandler(error);
    //console.log(error);
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

const deleteLoss = async (req, res) => {
  const _id = req.body._id;
  console.log(_id);
  try {
    let loss = await LossModel.findById(_id);

    if (!loss) {
      res.json({
        error: true,
        message: "No se encontró la pérdida solicitada",
        response: null,
      });

      return;
    }

    let quantityToAdd = loss.quantity;
    let productID = loss.productID;

    await LossModel.deleteOne({ _id });
    let product = await productModel.findById(productID);

    product.history = product.history.filter((history) => {
      history._id != productID;
    });

    product.quantity = product.quantity += quantityToAdd;

    await product.save();

    res.json({
      error: false,
      message: "La pérdida fue eliminada correctamente.",
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

const searchLosses = async (req, res) => {
  let { fechaInicio, fechaFin, canceled } = req.body;

  fechaInicio = fechaInicio.split("T");
  fechaInicio = `${fechaInicio[0]}T00:00:00z`;

  fechaFin = fechaFin.split("T");
  fechaFin = `${fechaFin[0]}T23:59:59z`;

  try {
    const losses = await LossModel.find({
      date: { $gte: fechaInicio, $lte: fechaFin },
    })
      .populate({
        path: "productID",
        select: "name",
        populate: { path: "brand", select: "name" },
      })
      .select("productID  quantity unitPrice date")
      .sort({ date: "asc" });

    res.json({
      error: false,
      message: "",
      response: losses,
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
  registerLoss,
  deleteLoss,
  searchLosses,
};
