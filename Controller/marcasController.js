const Brand = require("../Model/BrandModel");
const errorHandler = require("../Utils/Helpers/errorHandler");

const index = (req, res) => {
  res.render("productos/marcas", {
    sectionName: "Marcas",
    script: "marcasClient",
  });
};

const createBrand = async (req, res) => {
  let brand = new Brand(req.body);
  try {
    await brand.save();
    res.json({
      error: false,
    });
  } catch (error) {
    let errors = errorHandler(error);
    errors = errors.length === 0 ? error : errors;
    res.json({
      error: true,
      message: errors,
      response: null,
    });
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
    errors = errors.length === 0 ? error.errors : errors;

    res.json({
      error: true,
      message: errors,
      response: null,
    });
  }
};

const deleteBrand = async (req, res) => {
  let _id = req.body;

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
      message: "La marca fue eliminada correctamente",
      response: null,
    });
  } catch (error) {
    let errors = errorHandler(error);
    errors = errors.length === 0 ? error.errors : errors;

    res.json({
      error: true,
      message: errors,
      response: null,
    });
  }
};

const searchBrands = async (req, res) => {
  const { name } = req.body;
  try {
    console.log("before search");
    const brands = await Brand.find({
      name: { $regex: `.*${name}.*`, $options: "i" },
      disabled: false,
    });

    console.log(brands);
    res.json({
      error: false,
      message: null,
      response: brands,
    });
  } catch (error) {
    let errors = errorHandler(error);
    errors = errors.length === 0 ? error : errors;
    console.log(error);
    res.json({
      error: true,
      message: errors,
      response: null,
    });
  }
};

module.exports = {
  index,
  createBrand,
  updateBrand,
  deleteBrand,
  searchBrands,
};
