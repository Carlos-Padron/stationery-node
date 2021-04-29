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
    res.render("notFound");
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
      service:
        req.body.service === "." || req.body.service === null
          ? null
          : req.body.service,
      madeBy: req.user._id,
      saleDetail: saleDetails,
    });

    await sale.save();

    for (const prod of req.body.saleDetail) {
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
  let { fechaInicio, fechaFin, canceled } = req.body;

  fechaInicio = fechaInicio.split("T");
  fechaInicio = `${fechaInicio[0]}T00:00:00z`;

  fechaFin = fechaFin.split("T");
  fechaFin = `${fechaFin[0]}T23:59:59z`;

  try {
    let sales = await Sale.find({
      date: { $gte: fechaInicio, $lte: fechaFin },
      canceled,
    })
      .select("_id concept date total canceled ")
      .sort({ date: "asc" });

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
  const { id } = req.params;

  try {
    let sale = await Sale.findById(id)
      .populate({
        path: "madeBy",
        select: "name fatherSurname",
      })
      .populate({ path: "updatedBy", select: "name fatherSurname" })
      .populate({ path: "madeBy", select: "name fatherSurname" })
      .populate({ path: "saleDetail.productID", select: "name" })
      .lean();

    if (sale) {
      sale.discount = sale.discount == null ? 0 : sale.discount;
      sale.service = sale.service == null ? 0 : sale.service;
      sale.subtotal = sale.total - sale.discount - sale.service;

      sale.total = sale.total.toFixed(2);
      sale.subtotal = sale.subtotal.toFixed(2);
      sale.discount = sale.discount.toFixed(2);
      sale.service = sale.service.toFixed(2);

      sale.madeBy =
        sale.madeBy != null
          ? `${sale.madeBy.name.split(" ")[0]} ${sale.madeBy.fatherSurname}`
          : "";
      sale.updatedBy =
        sale.updatedBy != null
          ? `${sale.updatedBy.name.split(" ")[0]} ${
              sale.updatedBy.fatherSurname
            }`
          : "";

      sale.date = sale.date.toISOString().toString();

      let date = sale.date.substring(0, 10);
      let day = date.substring(8, 10);
      let month = date.substring(5, 7);
      let year = date.substring(0, 4);

      sale.date = `${day}/${month}/${year}`;

      res.render("ventas/detalleVenta", {
        sectionName: "Detalle de la venta",
        script: "detalleVentaClient",
        activeMenu: "VNTS",
        activeSubmenu: "HSVNTS",
        sale,
      });
    } else {
      res.render("notFound");
    }
  } catch (error) {
    console.log(error);
    res.render("notFound");
  }
};

const cancelSale = async (req, res) => {
  const { _id } = req.body;

  try {
    let sale = await Sale.findById(_id).populate({
      path: "saleDetails.productID",
    });

    if (!sale) {
      res.json({
        error: true,
        message: "No se encontró la venta solicitada.",
        response: null,
      });
      return;
    }

    sale.canceled = true;
    sale.updatedBy = req.user._id;
    await sale.save();

    for (const prod of sale.saleDetail) {
      await Product.findOneAndUpdate(
        { _id: prod.productID },
        { $inc: { quantity: prod.quantity } }
      ).exec();
    }

    res.json({
      error: false,
      response: sale._id,
      message: "Venta cancelada correctamente",
    });
  } catch (error) {
    let errors = errorHandler(error);
    console.log(error);
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

const editSale = async (req, res) => {
  const { id } = req.params;

  try {
    let brands = await Brand.find({ disabled: false }).sort({ name: "asc" });
    let articleTypes = await ArticleType.find({ disabled: false }).sort({
      name: "asc",
    });

    let sale = await Sale.findById(id)
      .populate({
        path: "saleDetail.productID",
      })
      .where("canceled")
      .equals(false)
      .lean();

    if (sale) {
      sale.saleDetail = JSON.stringify(sale.saleDetail);

      res.render("ventas/editarVenta", {
        sectionName: "Editar venta",
        script: "editarVentaClient",
        activeMenu: "VNTS",
        activeSubmenu: "HSVNTS",
        sale,
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

const updateSale = async (req, res) => {
  try {
    let saleDetails = [];
    let outOfStock = [];

    let sale = await Sale.findById(req.body._id);

    if (!sale) {
      res.json({
        error: true,
        message: "No se encontró la venta solicitada",
        response: null,
      });

      return;
    }

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

    sale.concept = req.body.concept;
    (sale.total = req.body.total),
      (sale.discount = req.body.discount != null ? req.body.discount : 0);
    sale.service =
      req.body.service === "." || req.body.service === null
        ? null
        : req.body.service;
    sale.updatedBy = req.user._id;
    sale.changed = true;

    let previouSaleDetail = sale.saleDetail;
    //Se asigna el nuevo detalle a la venta
    sale.saleDetail = saleDetails;

    await sale.save();

    let previouSaleDetailIDS = previouSaleDetail.map((e) =>
      e.productID.toString()
    );
    let saleDetailIDS = saleDetails.map((e) => e.productID.toString());

    //Busca los productos que se mantuvieron en la venta
    for (const prod of saleDetails) {
      let previousSaleProduct = previouSaleDetail.filter(
        (p) => prod.productID.toString() == p.productID
      );

      if (previousSaleProduct.length > 0) {
        if (prod.quantity > previousSaleProduct[0].quantity) {
          let diff = prod.quantity - previousSaleProduct[0].quantity;

          await Product.findOneAndUpdate(
            { _id: prod.productID },
            { $inc: { quantity: -diff } }
          ).exec();
        } else if (prod.quantity < previousSaleProduct[0].quantity) {
          await Product.findOneAndUpdate(
            { _id: prod.productID },
            { $inc: { quantity: prod.quantity } }
          ).exec();
        }
      }
    }

    //busca los productos que se removieron de la venta

    for (const prod of previouSaleDetail) {
      if (!saleDetailIDS.includes(prod.productID.toString())) {
        console.log("removed");

        await Product.findOneAndUpdate(
          { _id: prod.productID },
          { $inc: { quantity: prod.quantity } }
        ).exec();
      }
    }

    //Busca los productos que se agregaron a la venta

    for (const prod of saleDetails) {
      if (!previouSaleDetailIDS.includes(prod.productID.toString())) {
        console.log("added");
        await Product.findOneAndUpdate(
          { _id: prod.productID },
          { $inc: { quantity: prod.quantity } }
        ).exec();
      }
    }

    res.json({
      error: false,
      response: sale._id,
      message: "Venta actualizada correctamente",
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
  registerSale,
  saleHistory,
  searchSales,
  saleDetail,
  cancelSale,
  editSale,
  updateSale,
};
