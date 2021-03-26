const ArticleType = require("../Model/ArticleType");
const ArtycleType = require("../Model/ArticleType");
const errorHandler = require("../Utils/Helpers/errorHandler");

const index = (req, res) => {
  res.render("inventario/tiposArticulos", {
    sectionName: "Tipos de Artículos",
    script: "tiposArticulosClient",
  });
};

const createArticleType = async (req, res) => {
  delete req.body._id;

  try {
    let articleType = ArtycleType(req.body);

    await articleType.save();

    res.json({
      error: false,
      message: "El tipo de artículo se agregó correctamente.",
      response: null,
    });
  } catch (error) {
    let errors = errorHandler(error);

    if (errors.length === 0) {
      res
        .json({
          error: true,
          message: error,
          response: null,
        })
        .status(500);
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
  delete req.body;

  try {
    let articleType = ArtycleType.findById(_id).exec();

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
      res
        .json({
          error: true,
          message: error,
          response: null,
        })
        .status(500);
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
  const _id = req.body;

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
      message: "El tipo de artículo fue eliminado correctamente.",
      response: null,
    });
  } catch (error) {
    let errors = errorHandler(error);

    if (errors.length === 0) {
      res
        .json({
          error: true,
          message: error,
          response: null,
        })
        .status(500);
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
    const articleTypes = await ArticleType.find({
      name: {
        regex: `*.${name}.*`,
        $options: "i",
      },
      disabled: false,
    }).sort({ name: "asc" });

    res.json({
      error: false,
      message: "",
      response: articleTypes,
    });
  } catch (error) {
    let errors = errorHandler(error);

    if (errors.length === 0) {
      res
        .json({
          error: true,
          message: error,
          response: null,
        })
        .status(500);
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
  searchArticleType,
};
