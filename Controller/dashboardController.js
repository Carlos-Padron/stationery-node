const CashOut = require("../Model/CashOutModel");
const Sale = require("../Model/SaleModel");
const OtherMovements = require("../Model/OtherMovementModel");
const Loss = require("../Model/LossModel");

const index = async (req, res) => {
  let currentDay = new Date();
  let sevenDaysAgo = new Date();

  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7); 

  console.log(currentDay);
  console.log(sevenDaysAgo);

  try {
    res.render("dashboard/dashboard", {
      sectionName: "Tablero",
      script: "dashboardClient",
      activeMenu: "DSHBRD",
      activeSubmenu: "",
    });
  } catch (error) {}
};

module.exports = {
  index,
};
