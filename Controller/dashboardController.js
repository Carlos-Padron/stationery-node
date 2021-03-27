const index = (req, res) => {
  res.render("dashboard/dashboard",{
    sectionName: "Tablero",
    script: "dashboardClient",
    activeMenu: "DSHBRD",
    activeSubmenu: "",
  });
};

module.exports = {
  index,
};
