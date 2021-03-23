const index = (req, res) => {
  res.render("dashboard/dashboard",{
    sectionName: "Tablero",
    script: "dashboardClient",
  });
};

module.exports = {
  index,
};
