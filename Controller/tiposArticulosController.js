const ArticleType = require("../Model/ArticleType");
const errorHandler = require("../Utils/Helpers/errorHandler");
const { changeVowelsForRegex } = require("../Utils/Helpers/regrexHelper");

const index = (req, res) => {
  res.render("inventario/tiposArticulos", {
    sectionName: "Tipos de Artículos",
    script: "tiposArticulosClient",
    activeMenu: "INVTRO",
    activeSubmenu: "TPARTS",
  });
};

const createArticleType = async (req, res) => {
  delete req.body._id;

  try {
    let articleType = ArticleType(req.body);

    await articleType.save();

    res.json({
      error: false,
      message: "El tipo de artículo se agregó correctamente.",
      response: null,
    });
  } catch (error) {
    let errors = errorHandler(error);
    console.log(error);
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

const updateArticleType = async (req, res) => {
  const _id = req.body._id;
  delete req.body._id;

  try {
    let articleType = await ArticleType.findById(_id).exec();

    if (!articleType) {
      res.json({
        error: true,
        message: "No se encontró el tipo de artículo solicitado.",
        response: null,
      });
      return;
    }

    await ArticleType.findByIdAndUpdate(_id, req.body);

    res.json({
      error: false,
      message: "El tipo de artículo fue actulizado correctamente.",
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

const deleteArticleType = async (req, res) => {
  const _id = req.body._id;

  try {
    let articleType = await ArticleType.findById(_id);

    if (!articleType) {
      res.json({
        error: true,
        message: "No se encontró el artículo solicitado",
        response: null,
      });

      return;
    }

    articleType.disabled = true;
    await articleType.save();

    res.json({
      error: false,
      message: "El tipo de artículo fue deshabilitaado correctamente.",
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

const enableArticleType = async (req, res) => {
  const _id = req.body._id;

  try {
    let articleType = await ArticleType.findById(_id);

    if (!articleType) {
      res.json({
        error: true,
        message: "No se encontró el artículo solicitado",
        response: null,
      });

      return;
    }

    articleType.disabled = false;
    await articleType.save();

    res.json({
      error: false,
      message: "El tipo de artículo fue habilidato correctamente.",
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

const searchArticleType = async (req, res) => {
  const { name } = req.body;

  try {
    let filter = {
      name: {
        $regex: `.*${changeVowelsForRegex(name)}.*`,
        $options: "i",
      },
    };

    if (req.user.role != "admin") {
      filter.disabled = false;
    }

    const articleTypes = await ArticleType.find(filter).sort({ name: "asc" });

    res.json({
      error: false,
      message: "",
      response: articleTypes,
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

module.exports = {
  index,
  createArticleType,
  updateArticleType,
  deleteArticleType,
  enableArticleType,
  searchArticleType,
};
