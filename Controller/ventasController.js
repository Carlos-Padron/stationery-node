const errorHandler = require("../Utils/Helpers/errorHandler");
const Sale = require("../Model/ProductModel");
const Brand = require("../Model/BrandModel");
const ArticleType = require("../Model/ArticleType");

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
      articleTypes
    });
  } catch (error) {
    res.send("Ocurrió un error al mostrar la página.");
  }
};


const registerSale = async(req,res) =>{

}

const saleDetail = async(req,res) =>{

}

module.exports = {
  index,
  registerSale,
  saleDetail
};
