const fs = require("fs");
const hbs = require("hbs");
const path = require("path");
const pdf = require("html-pdf");

//Models

const Product = require("../../Model/ProductModel");
const Sale = require("../../Model/SaleModel");

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
  let { fechaInicio, fechaFin, canceled } = options;

  let logoImg = fs
    .readFileSync(path.join(__dirname, `../../Public/images/logo/logo.png`))
    .toString("base64");

  data.logo = logoImg;

  let date = new Date().toISOString().split("T")[0];
  console.log(date);

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
