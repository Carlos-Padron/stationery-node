const ArtycleType = require("../Model/ArticleType");

const index = (req, res) => {

    res.render("inventario/tiposArticulos", {
        sectionName: "Marcas",
        script: "marcasClient",
      });

    
};

module.exports = {
  index,
};
