const errorHandler = require("../Utils/Helpers/errorHandler");
const Product = require("../Model/ProductModel");
const Brand = require("../Model/BrandModel");
const ArticleType = require("../Model/ArticleType");

const fs = require("fs");
const imgHelper = require("../Utils/Helpers/imageHelper");
const mongoose = require("mongoose");

//!actualizacion la mercancía
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
  let base64Data = req.body.image;
  let productBody = req.body;
  let _id = mongoose.Types.ObjectId();

  req.body._id = _id;
  delete req.body.image;

  let imageRelativePath = `${req.protocol}://${req.get(
    "host"
  )}/images/productos/`;
  let imageAbsolutePath = `${__dirname}/Public/images/productos/`;
  productBody.history = [
    {
      date: new Date(),
      quantity: req.body.quantity,
      action: "add",
      description: "Se ingresó mercancia",
      madeBy: req.user._id,
    },
  ];
  try {
    const imageName = `${_id}.png`;
    imageAbsolutePath += imageName;
    imageRelativePath += imageName;

    if (base64Data != undefined) {
      let base64Image = base64Data.split(";base64,").pop();
      let buffer = Buffer.from(base64Image, "base64");

      let resultingBuffer = await imgHelper.resizeImgBuffer(buffer);
      if (resultingBuffer.error) {
        res.json({
          error: true,
          message: `Ocurrió un error al procesar la imagen: ${resultingBuffer.result}`,
          response: null,
        });

        return;
      }

      fs.writeFileSync(
        `Public/images/productos/${_id}.png`,
        resultingBuffer.result,
        {
          encoding: "base64",
        }
      );
      productBody.imageAbsolutePath = imageAbsolutePath;
      productBody.imageRelativePath = imageRelativePath;
    }

    let product = Product(productBody);
    await product.save();

    res.json({
      error: false,
      message: "El producto se agregó correctamente",
      response: null,
    });
  } catch (error) {
    if (fs.existsSync(imageAbsolutePath)) {
      fs.unlinkSync(imageAbsolutePath);
    }

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

const updateProduct = async (req, res) => {
  const _id = req.body._id;
  let newQuainity = req.body.quantity;

  let newStock;
  delete req.body._id;

  try {
    let product = await Product.findById(_id).exec();

    if (!product) {
      res.json({
        error: true,
        message: "No se encontró el producto solicitado.",
        response: null,
      });
      return;
    }

    newStock = product.quantity - newQuainity;

    if (parseInt(newStock) < 0) {
      res.json({
        error: true,
        message: "No puede haber inventario nagativo",
        response: null,
      });
      return;
    }

    if (req.body.image == null) {
      product.imageAbsolutePath = null;
      product.imageRelativePath = null;

      if (fs.existsSync(product.imageAbsolutePath)) {
        fs.unlinkSync(product.imageAbsolutePath);
      }
    } else if (req.body.image != null && req.body.image.includes("base64")) {
      let base64Image = req.body.image.split(";base64,").pop();
      let buffer = Buffer.from(base64Image, "base64");

      let resultingBuffer = await imgHelper.resizeImgBuffer(buffer);

      if (resultingBuffer.error) {
        res.json({
          error: true,
          message: `Ocurrió un error al procesar la imagen: ${resultingBuffer.result}`,
          response: null,
        });
        return;
      }

      fs.writeFileSync(
        `Public/images/productos/${product._id}.png`,
        resultingBuffer.result,
        {
          encoding: "base64",
        }
      );
    }

    product.name = req.body.name;
    product.price = req.body.price;
    product.quantity = req.body.quantity;
    product.articleType = req.body.articleType;
    product.brand = req.body.brand;

    product.history.append({
      date: new Date(),
      quantity: req.body.quantity,
      action: newStock > product.quantity ? "add" : "subtract",
      description: "Se ctualizó mercancia",
      madeBy: req.user._id,
    });

    await product.save();

    res.json({
      error: false,
      message: "La marca fue actualizada correctamente.",
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

const searchProducts = async (req, res) => {
  const { name, brand, articleType } = req.body;

  console.log(req.body);

  let filter = {
    name: { $regex: `.*${name}.*` },
    disabled: false,
  };

  if (brand != "") {
    filter.brand = brand;
  }

  if (articleType != "") {
    filter.articleType = articleType;
  }

  try {
    let products = await Product.find(filter)
      .populate({ path: "articleType", select: "name" })
      .populate({ path: "brand", select: "name" })
      .select("name price quantity imageRelativePath articleType brand")
      .exec();

    res.json({
      error: false,
      message: null,
      response: products,
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
  searchProducts,
};
