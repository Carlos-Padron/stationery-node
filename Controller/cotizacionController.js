const errorHandler = require("../Utils/Helpers/errorHandler");
const Quote = require("../Model/QuoteModel");
const Sale = require("../Model/SaleModel");
const Brand = require("../Model/BrandModel");
const ArticleType = require("../Model/ArticleType");
const Product = require("../Model/ProductModel");

const index = async (req, res) => {
  res.render("cotizaciones/cotizaciones", {
    sectionName: "Cotizaciones",
    script: "cotizacionesClient",
    activeMenu: "CTZCNS",
  });
};

const newQuote = async (req, res) => {
  try {
    let brands = await Brand.find({ disabled: false }).sort({ name: "asc" });
    let articleTypes = await ArticleType.find({ disabled: false }).sort({
      name: "asc",
    });

    res.render("cotizaciones/nuevaCotizacion", {
      sectionName: "Nueva cotización",
      script: "nuevaCotizacionClient",
      activeMenu: "CTZCNS",
      brands,
      articleTypes,
    });
  } catch (error) {
    res.render("notFound");
  }
};

const registerQuote = async (req, res) => {
  try {
    let quoteDetails = [];
    let serviceDetails = [];
    let outOfStock = [];

    //Verifify if product exists and has enough stock
    for (const prod of req.body.quoteDetail) {
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
          quoteDetails.push({
            productID: prod.productID,
            quantity: prod.quantity,
            unitPrice: prod.unitPrice,
          });
        }
      }
    }

    //adds services to the sale
    req.body.serviceDetail.forEach((service) => {
      serviceDetails.push({
        description: service.description,
        total: service.total,
      });
    });

    if (outOfStock.length > 0) {
      return res.json({
        error: true,
        message: outOfStock,
        response: null,
      });
    }

    let quote = await Quote({
      concept: req.body.concept,
      date: new Date(),
      total: req.body.total,
      discount: req.body.discount != null ? req.body.discount : 0,
      extra:
        req.body.extra === "." || req.body.extra === null
          ? null
          : req.body.extra,
      madeBy: req.user._id,
      quoteDetail: quoteDetails,
      serviceDetail: serviceDetails,
    });

    await quote.save();

    res.json({
      error: false,
      response: quote._id,
      message: "Cotización registrada correctamente",
    });
  } catch (error) {
    console.log(error);
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

const searchQuotes = async (req, res) => {
  let { fechaInicio, fechaFin } = req.body;

  fechaInicio = fechaInicio.split("T");
  fechaInicio = `${fechaInicio[0]}T00:00:00z`;

  fechaFin = fechaFin.split("T");
  fechaFin = `${fechaFin[0]}T23:59:59z`;

  try {
    let quotes = await Quote.find({
      date: { $gte: fechaInicio, $lte: fechaFin },
    })
      .select("_id concept date total")
      .sort({ date: "asc" });

    res.json({
      error: false,
      message: null,
      response: quotes,
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

const quoteDetail = async (req, res) => {
  const { id } = req.params;

  try {
    let quote = await Quote.findById(id)
      .populate({
        path: "madeBy",
        select: "name fatherSurname",
      })
      .populate({ path: "updatedBy", select: "name fatherSurname" })
      .populate({ path: "madeBy", select: "name fatherSurname" })
      .populate({ path: "quoteDetail.productID", select: "name" })
      .populate({ path: "quoteDetail.productID.brand", select: "name" })
      .lean();

    if (quote) {
      quote.discount = quote.discount == null ? 0 : quote.discount;
      quote.extra = quote.extra == null ? 0 : quote.extra;
      quote.subtotal = quote.total + quote.extra;

      quote.total = quote.total.toFixed(2);
      quote.subtotal = quote.subtotal.toFixed(2);
      quote.discount = quote.discount.toFixed(2);
      quote.extra = quote.extra.toFixed(2);

      quote.madeBy =
        quote.madeBy != null
          ? `${quote.madeBy.name.split(" ")[0]} ${quote.madeBy.fatherSurname}`
          : "";
      quote.updatedBy =
        quote.updatedBy != null
          ? `${quote.updatedBy.name.split(" ")[0]} ${
              quote.updatedBy.fatherSurname
            }`
          : "";

      quote.date = quote.date.toISOString().toString();
      let date = quote.date.substring(0, 10);
      let day = date.substring(8, 10);
      let month = date.substring(5, 7);
      let year = date.substring(0, 4);

      quote.date = `${day}/${month}/${year}`;

      res.render("cotizaciones/detalleCotizacion", {
        sectionName: "Detalle de la cotización",
        script: "detalleCotizacionClient",
        activeMenu: "CTZCNS",
        quote,
      });
    } else {
      res.render("notFound");
    }
  } catch (error) {
    res.render("notFound");
  }
};

const editQuote = async (req, res) => {
  const { id } = req.params;

  try {
    let brands = await Brand.find({ disabled: false }).sort({ name: "asc" });
    let articleTypes = await ArticleType.find({ disabled: false }).sort({
      name: "asc",
    });

    let quote = await Quote.findById(id)
      .populate({
        path: "quoteDetail.productID",
      })
      .lean();

    if (quote) {
      quote.quoteDetail = JSON.stringify(quote.quoteDetail);
      quote.serviceDetail = JSON.stringify(quote.serviceDetail);

      console.log(quote);
      res.render("cotizaciones/editarCotizacion", {
        sectionName: "Editar cotizacion",
        script: "editarCotizacionClient",
        activeMenu: "CTZCNS",
        quote,
        brands,
        articleTypes,
      });
    } else {
      res.render("notFound");
    }
  } catch (error) {
    res.render("notFound");
  }
};

const updateQuote = async (req, res) => {
  try {
    let quoteDetails = [];
    let serviceDetails = [];
    let outOfStock = [];

    let quote = await Quote.findById(req.body._id);

    if (!quote) {
      res.json({
        error: true,
        message: "No se encontró la cotización solicitada",
        response: null,
      });

      return;
    }

    for (const prod of req.body.quoteDetail) {
      let product = await Product.findById(prod.productID).select(
        "_id name price quantity"
      );

      if (!product) {
        outOfStock.push(
          `No se encontró ${prod.productName} en el catálogo de productos.`
        );
      } else {
        let productInQuote = quote.quoteDetail.find((quoteProd) => {
          return quoteProd.productID.toString() == product._id.toString();
        });

        if (productInQuote) {
          //compares if the quantity of th product of the quote is equal to the quantity of the prodct of the uptdate quote
          console.log("hay");
          if (prod.quantity != productInQuote.quantity) {
            if (prod.quantity > product.quantity) {
              outOfStock.push(
                `La cantidad agregada de ${prod.productName} supera a la cantidad de stock del inventario.`
              );
            } else {
              quoteDetails.push({
                productID: prod.productID,
                quantity: prod.quantity,
                unitPrice: prod.unitPrice,
              });
            }
          } else {
            quoteDetails.push({
              productID: prod.productID,
              quantity: prod.quantity,
              unitPrice: prod.unitPrice,
            });
          }
        } else {
          if (prod.quantity > product.quantity) {
            outOfStock.push(
              `La cantidad agregada de ${prod.productName} supera a la cantidad de stock del inventario.`
            );
          } else {
            quoteDetails.push({
              productID: prod.productID,
              quantity: prod.quantity,
              unitPrice: prod.unitPrice,
            });
          }
        }
      }
    }

    //adds services to the sale
    req.body.serviceDetail.forEach((service) => {
      serviceDetails.push({
        description: service.description,
        total: service.total,
      });
    });

    if (outOfStock.length > 0) {
      return res.json({
        error: true,
        message: outOfStock,
        response: null,
      });
    }

    quote.concept = req.body.concept;
    quote.total = req.body.total;
    quote.discount = req.body.discount != null ? req.body.discount : 0;
    quote.extra =
      req.body.extra === "." || req.body.extra === null ? null : req.body.extra;
    quote.updatedBy = req.user._id;

    quote.quoteDetail = quoteDetails;
    quote.serviceDetail = serviceDetails;

    await quote.save();

    res.json({
      error: false,
      response: quote._id,
      message: "Cotización actualizada correctamente",
    });
  } catch (error) {
    console.log(error);
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

const sellQuote = async (req, res) => {
  try {
    let quoteDetails = [];
    let serviceDetails = [];
    let outOfStock = [];

    let quote = await Quote.findById(req.body._id);

    if (!quote) {
      res.json({
        error: true,
        message: "No se encontró la cotización solicitada",
        response: null,
      });

      return;
    }

    for (const prod of req.body.quoteDetail) {
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
          quoteDetails.push({
            productID: prod.productID,
            quantity: prod.quantity,
            unitPrice: prod.unitPrice,
          });
        }
      }
    }

    req.body.serviceDetail.forEach((service) => {
      serviceDetails.push({
        description: service.description,
        total: service.total,
      });
    });

    if (outOfStock.length > 0) {
      return res.json({
        error: true,
        message: outOfStock,
        response: null,
      });
    }

    await Quote.deleteOne({ _id: quote._id });

    let sale = Sale();

    sale.concept = req.body.concept;
    sale.date = new Date();
    sale.total = req.body.total;
    sale.discount = req.body.discount != null ? req.body.discount : 0;

    sale.extra =
      req.body.extra === "." || req.body.extra === null ? null : req.body.extra;
    sale.madeBy = req.user._id;
    sale.saleDetail = quoteDetails;
    sale.serviceDetail = serviceDetails;

    await sale.save();

    for (const prod of quoteDetails) {
      await Product.findOneAndUpdate(
        { _id: prod.productID },
        { $inc: { quantity: -prod.quantity } }
      ).exec();
    }

    res.json({
      error: false,
      response: sale._id,
      message: "Venta registrada correctamente",
    });
  } catch (error) {
    console.log(error);
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
  newQuote,
  registerQuote,
  searchQuotes,
  quoteDetail,
  editQuote,
  updateQuote,
  sellQuote,
};
