const errorHandler = require("../Utils/Helpers/errorHandler");
const Product = require("../Model/ProductModel");
const Brand = require("../Model/BrandModel");
const ArticleType = require("../Model/ArticleType");
const mongoose = require("mongoose");

const fs = require("fs");
const imgHelper = require("../Utils/Helpers/imageHelper");
const { changeVowelsForRegex } = require("../Utils/Helpers/regrexHelper");

//!actualizacion la mercancía
//!Devolucion de mercanía
//!Périda de mercancía

const index = async (req, res) => {
  try {
    let brands = await Brand.find({ disabled: false }).sort({ name: "asc" });
    let articleTypes = await ArticleType.find({ disabled: false }).sort({
      name: "asc",
    });

    res.render("inventario/productos", {
      sectionName: "Productos",
      script: "productosClient",
      activeMenu: "INVTRO",
      activeSubmenu: "PRDCTS",
      brands,
      articleTypes,
    });
  } catch (error) {
    res.render("notFound");
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

    if (
      base64Data != null &&
      base64Data != `${process.env.DEFAULT_PRODUCTS_ROUTE}productos` &&
      base64Data != `${process.env.DEFAULT_PRODUCTS_ROUTE}null`
    ) {
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
    console.log(error.message);
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
  let newStock = req.body.quantity;
  let currentStock = 0;

  let imageRelativePath = `${req.protocol}://${req.get(
    "host"
  )}/images/productos/`;
  let imageAbsolutePath = `${__dirname}/Public/images/productos/`;

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

    currentStock = product.quantity;

    if (parseInt(newStock) < 0) {
      res.json({
        error: true,
        message: "No puede haber inventario nagativo",
        response: null,
      });
      return;
    }

    if (
      req.body.image == null ||
      req.body.image == process.env.DEFAULT_PRODUCTS_ROUTE
    ) {
      console.log("sin imagen");
      product.imageAbsolutePath = null;
      product.imageRelativePath = null;

      if (fs.existsSync(product.imageAbsolutePath)) {
        fs.unlinkSync(product.imageAbsolutePath);
      }
    } else if (req.body.image != null && req.body.image.includes("base64")) {
      console.log("con imagen nueva");

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
      let imageName = `${product._id}.png`;
      imageAbsolutePath += imageName;
      imageRelativePath += imageName;

      product.imageAbsolutePath = imageAbsolutePath;
      product.imageRelativePath = imageRelativePath;
    }

    product.name = req.body.name;
    product.price = req.body.price;
    product.quantity = req.body.quantity;
    product.articleType = req.body.articleType;
    product.brand = req.body.brand;

    let action = "";
    if (newStock > currentStock) {
      action = "add";
    } else if (newStock < currentStock) {
      action = "subtract";
    } else {
      action = "same";
    }

    product.history.push({
      date: new Date(),
      quantity: req.body.quantity,
      action,
      description: "Se actualizó mercancia",
      madeBy: req.user._id,
    });

    await product.save();

    res.json({
      error: false,
      message: "El producto fue actualizado correctamente.",
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

const showProduct = async (req, res) => {
  const _id = req.body._id;

  try {
    let product = await Product.findById(_id)
      .populate({ path: "brand", select: "name" })
      .populate({ path: "articleType", select: "name" })
      .populate({
        path: "history.madeBy",
        select: "name fatherSurname",
      })
      .select("name price quantity imageRelativePath articleType brand history")
      .exec();

    if (!product) {
      res.json({
        error: true,
        message: "No se encontró el producto solicitado.",
        response: null,
      });
      return;
    }

    product.history.sort(
      (hist1, hist2) => new Date(hist2.date) - new Date(hist1.date)
    );

    res.json({
      error: false,
      message: null,
      response: product,
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

const deleteProduct = async (req, res) => {
  const { _id } = req.body;

  try {
    let product = await Product.findById(_id);

    if (!product) {
      res.json({
        error: true,
        message: "No se encontró el producto solicitada.",
        response: null,
      });
      return;
    }

    product.disabled = true;
    await product.save();
    res.json({
      error: false,
      message: "El producto fue desabilitado correctamente",
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

  let filter = {
    disabled: false,
  };

  if (name) {
    filter.name = {
      $regex: `.*${changeVowelsForRegex(name)}.*`,
      $options: "i",
    };
  }

  if (brand) {
    filter.brand = brand;
  }

  if (articleType) {
    filter.articleType = articleType;
  }

  try {
    let products = await Product.find(filter)
      .populate({ path: "articleType", select: "name" })
      .populate({ path: "brand", select: "name" })
      .select("name price quantity imageRelativePath articleType brand")
      .sort({ name: "asc", articleType: "asc", brand: "asc" })
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

const searchProductsWithStock = async (req, res) => {
  const { name, brand, articleType } = req.body;

  let filter = {
    disabled: false,
  };

  if (name) {
    filter.name = {
      $regex: `.*${changeVowelsForRegex(name)}.*`,
      $options: "i",
    };
  }

  if (brand) {
    filter.brand = brand;
  }

  if (articleType) {
    filter.articleType = articleType;
  }

  try {
    let products = await Product.find(filter)
      .populate({ path: "articleType", select: "name" })
      .populate({ path: "brand", select: "name" })
      .select("name price quantity imageRelativePath articleType brand")
      .sort({ name: "asc", articleType: "asc", brand: "asc" })
      .where("quantity")
      .gt(0)
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

const getProductsForCombo = async (req, res) => {
  const { name, brand, articleType } = req.body;

  let filter = {
    disabled: false,
  };

  if (name) {
    filter.name = {
      $regex: `.*${changeVowelsForRegex(name)}.*`,
      $options: "i",
    };
  }

  if (brand) {
    filter.brand = brand;
  }

  if (articleType) {
    filter.articleType = articleType;
  }

  try {
    let products = await Product.find(filter)
      .select("name")
      .sort({ name: "asc", articleType: "asc", brand: "asc" })
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
  showProduct,
  updateProduct,
  deleteProduct,
  searchProductsWithStock,
  getProductsForCombo,
};
