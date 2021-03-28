const User = require("../Model/UserModel");
const errorHandler = require("../Utils/Helpers/errorHandler");

const index = (req, res) => {
  res.render("usuarios/usuarios", {
    sectionName: "Usuarios",
    script: "usuariosClient",
  });
};

const createUser = async (req, res) => {
  delete req.body._id;

  try {
    const user = new User(req.body);

    await user.save();
    res.json({
      error: false,
      message: "El usuario se agregó correctamente.",
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

const updateUser = async (req, res) => {
  const _id = req.body._id;
  delete req.body._id;
  console.log(req.body);
  try {
    let user = await User.findById(_id).exec();

    if (!user) {
      res.json({
        error: true,
        message: "No se econtró al usuario solicitado.",
        response: null,
      });
      return;
    }

    await User.findByIdAndUpdate(_id, req.body).exec();

    res.json({
      error: false,
      message: "El usuario actualizado correctamente.",
      response: null,
    });
  } catch (error) {
    console.log(error);
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

const deleteUser = async (req, res) => {
  const _id = req.body._id;

  try {
    let user = await User.findById(_id).exec();

    if (!user) {
      res.json({
        error: true,
        message: "No se encontró al usuario solicitado.",
        response: null,
      });
      return;
    }

    user.disabled = true;
    await user.save();
    res.json({
      error: false,
      message: "El usuario fue desabilitado correctamente.",
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

const searchUsers = async (req, res) => {
  const { name } = req.body;

  try {
    const users = await User.find({
      name: { $regex: `.*${name}.*`, $options: "i" },
      disabled: false,
    }).sort({ name: "asc" });

    res.json({
      error: false,
      message: null,
      response: users,
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
  searchUsers,
  createUser,
  updateUser,
  deleteUser,
};
