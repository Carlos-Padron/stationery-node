const fs = require("fs");
const hbs = require("hbs");
const path = require("path");
const pdf = require("html-pdf");
const moment = require("moment-timezone")

//Models

const Product = require("../../Model/ProductModel");
const Sale = require("../../Model/SaleModel");
const Quote = require("../../Model/QuoteModel");
const CashOut = require("../../Model/CashOutModel");

const renderTemplate = async (templateName, options) => {
  let html = fs.readFileSync(
    path.join(__dirname, `../../View/reports/${templateName}.hbs`),
    "utf-8"
  );
  let info = await prepateDataForTemplate(templateName, options);
  /* var base64data = Buffer.from(binaryPicture, "binary").toString("base64");
  const pictureHtml = `<img src="data:image/png;base64","${base64data}">`; */

  let template = hbs.compile(html);

  let renderedTemplate = template(info);

  return renderedTemplate;
};



const prepateDataForTemplate = async (templateName, options) => {
  let data = {};
  let { fechaInicio, fechaFin, _id } = options;

  let logoImg = fs
    .readFileSync(path.join(__dirname, `../../Public/images/logo/logo.png`))
    .toString("base64");

  data.logo = logoImg;

  let date = moment.tz("America/Mexico_City").format().split("T")[0];

  let day = date.substring(8, 10);
  let month = date.substring(5, 7);
  let year = date.substring(0, 4);

  data.date = `${day}/${month}/${year}`;

  switch (templateName) {
    case "productsReport":
      let products = await Product.find({ disabled: false })
        .populate({ path: "articleType", select: "name" })
        .populate({ path: "brand", select: "name" })
        .select("name price quantity articleType brand")
        .sort({ name: "asc", articleType: "asc", brand: "asc" })
        .lean();

      products.forEach((prod) => {
        prod.price = prod.price.toFixed(2);
      });

      data.products = products;

      break;

    case "lowProductsReport":
      let lowStockProducts = await Product.find({
        disabled: false,
        quantity: {
          $lte: 30,
        },
      })
        .populate({ path: "articleType", select: "name" })
        .populate({ path: "brand", select: "name" })
        .select("name price quantity articleType brand")
        .sort({ name: "asc", articleType: "asc", brand: "asc" })
        .lean();

      lowStockProducts.forEach((prod) => {
        prod.price = prod.price.toFixed(2);
      });

      console.log(lowStockProducts);

      data.products = lowStockProducts;

      break;

    case "salesDone":
      fechaInicio = fechaInicio.split("T");
      let initialDateSalesDone = `${fechaInicio[0].substring(
        8,
        10
      )}/${fechaInicio[0].substring(5, 7)}/${fechaInicio[0].substring(0, 4)}`;
      fechaInicio = `${fechaInicio[0]}T00:00:00z`;

      fechaFin = fechaFin.split("T");
      let endDateSalesDone = `${fechaFin[0].substring(
        8,
        10
      )}/${fechaFin[0].substring(5, 7)}/${fechaFin[0].substring(0, 4)}`;
      fechaFin = `${fechaFin[0]}T23:59:59z`;

      let sales = await Sale.find({
        date: { $gte: fechaInicio, $lte: fechaFin },
      })
        .select("concept date total ")
        .sort({ date: "asc" })
        .lean();

      sales.forEach((elem) => {
        elem.total = `$${elem.total.toFixed(2)}`;

        let date = elem.date.toISOString().substring(0, 10);
        console.log(date);
        let day = date.substring(8, 10);
        let month = date.substring(5, 7);
        let year = date.substring(0, 4);

        elem.date = `${day}/${month}/${year}`;
      });

      data.sales = sales;
      data.date1 = initialDateSalesDone;
      data.date2 = endDateSalesDone;
      break;

    case "salesCanceled":
      fechaInicio = fechaInicio.split("T");
      let initialDateSalesCanceled = `${fechaInicio[0].substring(
        8,
        10
      )}/${fechaInicio[0].substring(5, 7)}/${fechaInicio[0].substring(0, 4)}`;
      fechaInicio = `${fechaInicio[0]}T00:00:00z`;

      fechaFin = fechaFin.split("T");
      let endDateSalesCanceled = `${fechaFin[0].substring(
        8,
        10
      )}/${fechaFin[0].substring(5, 7)}/${fechaFin[0].substring(0, 4)}`;
      fechaFin = `${fechaFin[0]}T23:59:59z`;

      let salesCanceld = await Sale.find({
        date: { $gte: fechaInicio, $lte: fechaFin },
        canceled: true,
      })
        .select("concept date total ")
        .sort({ date: "asc" })
        .lean();

      salesCanceld.forEach((elem) => {
        elem.total = `$${elem.total.toFixed(2)}`;

        let date = elem.date.toISOString().substring(0, 10);
        console.log(date);
        let day = date.substring(8, 10);
        let month = date.substring(5, 7);
        let year = date.substring(0, 4);

        elem.date = `${day}/${month}/${year}`;
      });

      data.sales = salesCanceld;
      data.date1 = initialDateSalesCanceled;
      data.date2 = endDateSalesCanceled;
      break;

    case "saleDetail":
      let saleDetail = await Sale.findById(_id)
        .populate({
          path: "madeBy",
          select: "name fatherSurname",
        })
        .populate({ path: "updatedBy", select: "name fatherSurname" })
        .populate({ path: "madeBy", select: "name fatherSurname" })
        .populate({ path: "saleDetail.productID", select: "name" })
        .populate({ path: "saleDetail.productID.brand", select: "name" })
        .lean();

      if (saleDetail) {
        saleDetail.discount =
          saleDetail.discount == null ? 0 : saleDetail.discount;
        saleDetail.extra = saleDetail.extra == null ? 0 : saleDetail.extra;
        saleDetail.subtotal =
          saleDetail.total - saleDetail.extra + saleDetail.discount;

        saleDetail.total = saleDetail.total.toFixed(2);
        saleDetail.subtotal = saleDetail.subtotal.toFixed(2);
        saleDetail.discount = saleDetail.discount.toFixed(2);
        saleDetail.extra = saleDetail.extra.toFixed(2);

        saleDetail.madeBy =
          saleDetail.madeBy != null
            ? `${saleDetail.madeBy.name.split(" ")[0]} ${
                saleDetail.madeBy.fatherSurname
              }`
            : "";
        saleDetail.updatedBy =
          saleDetail.updatedBy != null
            ? `${saleDetail.updatedBy.name.split(" ")[0]} ${
                saleDetail.updatedBy.fatherSurname
              }`
            : "";

        saleDetail.date = saleDetail.date.toISOString().toString();

        let date = saleDetail.date.substring(0, 10);
        let day = date.substring(8, 10);
        let month = date.substring(5, 7);
        let year = date.substring(0, 4);

        saleDetail.date = `${day}/${month}/${year}`;

        saleDetail.saleDetail.forEach((detail) => detail.unitPrice.toFixed(2));
        saleDetail.serviceDetail.forEach((detail) => detail.total.toFixed(2));

        data.sale = saleDetail;
      } else {
        throw new Error("No se encontró la venta solicitada");
      }
      break;

    case "quoteDetail":
      let quoteDetail = await Quote.findById(_id)
        .populate({
          path: "madeBy",
          select: "name fatherSurname",
        })
        .populate({ path: "updatedBy", select: "name fatherSurname" })
        .populate({ path: "madeBy", select: "name fatherSurname" })
        .populate({ path: "quoteDetail.productID", select: "name" })
        .populate({ path: "quoteDetail.productID.brand", select: "name" })
        .lean();

      if (quoteDetail) {
        quoteDetail.discount =
          quoteDetail.discount == null ? 0 : quoteDetail.discount;
        quoteDetail.extra = quoteDetail.extra == null ? 0 : quoteDetail.extra;
        quoteDetail.subtotal =
          quoteDetail.total - quoteDetail.extra + quoteDetail.discount;

        quoteDetail.total = quoteDetail.total.toFixed(2);
        quoteDetail.subtotal = quoteDetail.subtotal.toFixed(2);
        quoteDetail.discount = quoteDetail.discount.toFixed(2);
        quoteDetail.extra = quoteDetail.extra.toFixed(2);

        quoteDetail.madeBy =
          quoteDetail.madeBy != null
            ? `${quoteDetail.madeBy.name.split(" ")[0]} ${
                quoteDetail.madeBy.fatherSurname
              }`
            : "";
        quoteDetail.updatedBy =
          quoteDetail.updatedBy != null
            ? `${quoteDetail.updatedBy.name.split(" ")[0]} ${
                quoteDetail.updatedBy.fatherSurname
              }`
            : "";

        quoteDetail.date = quoteDetail.date.toISOString().toString();

        let date = quoteDetail.date.substring(0, 10);
        let day = date.substring(8, 10);
        let month = date.substring(5, 7);
        let year = date.substring(0, 4);

        quoteDetail.date = `${day}/${month}/${year}`;

        quoteDetail.quoteDetail.forEach((detail) =>
          detail.unitPrice.toFixed(2)
        );
        console.log(quoteDetail);
        quoteDetail.serviceDetail.forEach((detail) => detail.total.toFixed(2));

        data.quote = quoteDetail;
      } else {
        throw new Error("No se encontró la cotización solicitada");
      }

    case "cashOuts":
      fechaInicio = fechaInicio.split("T");
      let initialDateCashout = `${fechaInicio[0].substring(
        8,
        10
      )}/${fechaInicio[0].substring(5, 7)}/${fechaInicio[0].substring(0, 4)}`;
      fechaInicio = `${fechaInicio[0]}T00:00:00z`;

      fechaFin = fechaFin.split("T");
      let endDateCashout = `${fechaFin[0].substring(
        8,
        10
      )}/${fechaFin[0].substring(5, 7)}/${fechaFin[0].substring(0, 4)}`;
      fechaFin = `${fechaFin[0]}T23:59:59z`;

        console.log({
          date: { $gte: fechaInicio, $lte: fechaFin },
        });

      let cashOuts = await CashOut.find({
        date: { $gte: fechaInicio, $lte: fechaFin },
      }).sort({ date: "asc" });

      cashOuts.forEach((elem) => {

        let date = elem.date.toISOString().substring(0, 10);

        let day = date.substring(8, 10);
        let month = date.substring(5, 7);
        let year = date.substring(0, 4);

        elem.cashOutDate = `${day}/${month}/${year}`;
        elem.sales = elem.totalSales
      });



      data.cashOuts = cashOuts;
      data.date1 = initialDateCashout;
      data.date2 = endDateCashout;

      break;
    default:
      break;
  }

  return data;
};

const createPDF = (html) => {
  return new Promise((resolve, reject) => {
    pdf
      .create(
        html,

        {
          border: {
            top: "0.5in", // default is 0, units: mm, cm, in, px
            right: "0.5in",
            left: "0.5in",
          },
          height: "10.5in",
          width: "8in",
          footer: {
            height: "15mm",
            contents: {
              default:
                '<span style="color: #8898aa;font-size: 10px;"> Página {{page}} de {{pages}}</span> ', // fallback value
            },
          },
        }
      )
      .toBuffer(function (err, res) {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
  });
};

module.exports = {
  renderTemplate,
  createPDF,
};
