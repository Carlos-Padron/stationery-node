const Sale = require("../Model/ProductModel");

const index = (req, res) => {
  res.render("ventas/nuevaVenta", {
    sectionName: "Nueva venta",
    script: "nuevaVentaClient",
    activeMenu: "VNTS",
    activeSubmenu: "NVNTA",
  });
};

module.exports = {
  index,
};
