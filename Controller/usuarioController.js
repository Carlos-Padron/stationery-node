const User = require("../Model/UserModel");
const errorHandler = require("../Utils/Helpers/errorHandler");

const index = (req, res) => {
  res.render("usuarios/usuarios", {
    sectionName: "Usuarios",
    subsectionName: "",
    script: "usuariosClient",
  });
};

const createUser = async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.json({
      error: false,
      message: "Usuario creado correctamente.",
      response: null,
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

const updateUser = async (req, res) => {
  const _id = req.body._id;
  delete req.body._id;

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
      message: "Usuario actualizado correctamente.",
      response: null,
    });
  } catch (error) {
    console.log(error);
    let errors = errorHandler(error);
    errors = errors.length === 0 ? error.errors : errors;

    res.json({
      error: true,
      message: errors,
      response: null,
    });
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
    await User.findByIdAndDelete(_id).exec();

    res.json({
      error: false,
      message: "Usuario eliminado correctamente.",
      response: null,
    });
  } catch (error) {
    console.log(error);
    let errors = errorHandler(error);
    errors = errors.length === 0 ? error.errors : errors;

    res.json({
      error: true,
      message: errors,
      response: null,
    });
  }
};

const searchUsers = async (req, res) => {
  const { name } = req.body;

  console.log(req.body);
  try {
    const users = await User.find({
      name: { $regex: ".*" + name + ".*", $options: "i" },
    });

    res.json({
      error: false,
      message: null,
      response: users,
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

module.exports = {
  index,
  searchUsers,
  createUser,
  updateUser,
  deleteUser
};
