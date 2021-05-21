const User = require("../Model/UserModel");
const CashOut = require("../Model/CashOutModel");
const Product = require("../Model/ProductModel");
const Sale = require("../Model/SaleModel");
const OtherMovements = require("../Model/OtherMovementModel");

const index = async (req, res) => {
  let currentDay = new Date();
  let sevenDaysAgo = new Date();
  let todaySales = 0;

  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

  currentDay = `${currentDay.toISOString().split("T")[0]}T00:00:00z`;
  sevenDaysAgo = `${sevenDaysAgo.toISOString().split("T")[0]}T23:59:59z`;

  let users = await User.find({ disabled: false, role: "employee" });
  let cashOuts = await CashOut.find({
    date: { $gte: sevenDaysAgo, $lte: currentDay },
  })
    .select("totalSales date")
    .sort({ date: "asc" });

  let products = await Product.find({
    disabled: false,
    quantity: {
      $lte: 30,
    },
  })
    .populate({ path: "brand" })
    .select("name brand quantity")
    .lean();

  let sales = await Sale.find({
    canceled: false,
    date: { $gte: currentDay },
  }).select("total");

  let otherMovements = await OtherMovements.find({
    date: { $gte: currentDay },
  });

  let salida = otherMovements.filter((mov) => mov.type == "Salida de dinero");
  let entrada = otherMovements.filter((mov) => mov.type == "Ingreso de dinero");

  salida.forEach((mov) => {
    todaySales -= mov.amount;
  });

  entrada.forEach((mov) => {
    todaySales += mov.amount;
  });

  sales.forEach((sale) => {
    todaySales += sale.total;
  });

  products.forEach((prod, index) => {
    products[index].brand = prod.brand.name;
  });

  try {
    res.render("dashboard/dashboard", {
      sectionName: "Tablero",
      script: "dashboardClient",
      activeMenu: "DSHBRD",
      activeSubmenu: "",
      users: users.length,
      cashOuts: JSON.stringify(cashOuts),
      products: JSON.stringify(products),
      todaySalesBackEnd: todaySales,
    });
  } catch (error) {
    console.log(error);
    res.render("notFound");
  }
};

module.exports = {
  index,
};
