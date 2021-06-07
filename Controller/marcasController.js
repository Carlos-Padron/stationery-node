const Brand = require("../Model/BrandModel");
const errorHandler = require("../Utils/Helpers/errorHandler");
const { changeVowelsForRegex } = require("../Utils/Helpers/regrexHelper");

const index = (req, res) => {
  res.render("inventario/marcas", {
    sectionName: "Marcas",
    script: "marcasClient",
    activeMenu: "INVTRO",
    activeSubmenu: "MRCS",
  });
};

const createBrand = async (req, res) => {
  delete req.body._id;

  try {
    let brand = new Brand(req.body);

    await brand.save();
    res.json({
      error: false,
      message: "La marca se agregó correctamente",
      response: null,
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

const updateBrand = async (req, res) => {
  const _id = req.body._id;
  delete req.body._id;

  try {
    let brand = await Brand.findById(_id).exec();

    if (!brand) {
      res.json({
        error: true,
        message: "No se encontró la marca solicitada.",
        response: null,
      });
      return;
    }

    await Brand.findByIdAndUpdate(_id, req.body).exec();

    res.json({
      error: false,
      message: "La marca fue actualizada correctamente.",
      response: null,
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

const deleteBrand = async (req, res) => {
  const _id = req.body._id;

  try {
    let brand = await Brand.findById(_id).exec();

    if (!brand) {
      res.json({
        error: true,
        message: "No se encontró la marca solicitada.",
        response: null,
      });
      return;
    }

    brand.disabled = true;
    await brand.save();

    res.json({
      error: false,
      message: "La marca fue deshabilitada correctamente",
      response: null,
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

const enableBrand = async (req, res) => {
  const _id = req.body._id;

  try {
    let brand = await Brand.findById(_id).exec();

    if (!brand) {
      res.json({
        error: true,
        message: "No se encontró la marca solicitada.",
        response: null,
      });
      return;
    }

    brand.disabled = false;
    await brand.save();

    res.json({
      error: false,
      message: "La marca fue habilitada correctamente",
      response: null,
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

const searchBrands = async (req, res) => {
  const { name } = req.body;
  try {

    let filter = {
      name: { $regex: `.*${changeVowelsForRegex(name)}.*`, $options: "i" },
    };

    if (req.user.role != "admin") {
      filter.disabled = false;
    }

    const brands = await Brand.find(filter).sort({ name: "asc" });

    res.json({
      error: false,
      message: null,
      response: brands,
    });
  } catch (error) {
    let errors = errorHandler(error);

    if (errors.length === 0) {
      res.json({
        error: true,
        message: error,
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
  createBrand,
  updateBrand,
  deleteBrand,
  searchBrands,
  enableBrand,
};
