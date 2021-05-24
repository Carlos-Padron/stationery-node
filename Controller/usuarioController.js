const User = require("../Model/UserModel");
const errorHandler = require("../Utils/Helpers/errorHandler");

const fs = require("fs");
const imgHelper = require("../Utils/Helpers/imageHelper");
const { changeVowelsForRegex } = require("../Utils/Helpers/regrexHelper");

const index = (req, res) => {
  res.render("usuarios/usuarios", {
    sectionName: "Usuarios",
    script: "usuariosClient",
  });
};

const profile = async (req, res) => {
  try {
    let user = await User.findById(req.user._id);
    delete user.password;
    delete user.disabled;
    delete user.imageAbsolutePath;

    res.render("perfil/perfil", {
      sectionName: "Mi Perfil",
      script: "perfilClient",
      user,
      USER_ROUTE: process.env.DEFAULT_USER_ROUTE,

    });
  } catch (error) {
    console.log(error);
    res.render("notFound");
  }
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
  let _id;
  if (req.body._id == undefined) {
    _id = req.user._id;
  } else {
    _id = req.body._id;
    delete req.body._id;
  }
  console.log();

  let imageRelativePath = `${req.protocol}://${req.get("host")}/images/users/`;
  let imageAbsolutePath = `${__dirname}/Public/images/users/`;

  try {
    let user = await User.findById(_id).exec();
    let body = req.body;

    if (!user) {
      res.json({
        error: true,
        message: "No se econtró al usuario solicitado.",
        response: null,
      });
      return;
    }




    if (
      req.body.image == null ||
      req.body.image == process.env.DEFAULT_USER_ROUTE
    ) {
      body.imageAbsolutePath = null;
      body.imageRelativePath = null;

      if (fs.existsSync(user.imageAbsolutePath)) {
        fs.unlinkSync(user.imageAbsolutePath);
      }
    } else if (req.body.image != null && req.body.image.includes("base64")) {
      let base64Image = req.body.image.split(";base64,").pop();
      let buffer = Buffer.from(base64Image, "base64");

      let resultingBuffer = await imgHelper.resizeImgBuffer(buffer);

      if (resultingBuffer.error) {
        res.json({
          error: true,
          message: `Ocurrió un error al procesar la imagen: ${resultingBuffer.result}`,
          response: null,
        });
        return;
      }

      fs.writeFileSync(
        `Public/images/users/${user._id}.png`,
        resultingBuffer.result,
        {
          encoding: "base64",
        }
      );
      let imageName = `${user._id}.png`;
      imageAbsolutePath += imageName;
      imageRelativePath += imageName;

      body.imageAbsolutePath = imageAbsolutePath;
      body.imageRelativePath = imageRelativePath;

      delete body.image;
    }

    let updatedUser = await User.findOneAndUpdate({ _id }, body, {
      new: true,
      runValidators: true,
      context: "query",
    }).exec();

    res.json({
      error: false,
      message: "El perfil actualizado correctamente.",
      response: {
        image: updatedUser.imageRelativePath,
        name: `${updatedUser.name.split(" ")[0]} ${updatedUser.fatherSurname}`,
      },
    });
  } catch (error) {
    if (fs.existsSync(imageAbsolutePath)) {
      fs.unlinkSync(imageAbsolutePath);
    }
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

const enableUser = async (req, res) => {
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

    user.disabled = false;
    await user.save();
    res.json({
      error: false,
      message: "El usuario fue habilitado correctamente.",
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
      $or: [
        {
          name: { $regex: `.*${changeVowelsForRegex(name)}.*`, $options: "i" },
        },
        {
          fatherSurname: {
            $regex: `.*${changeVowelsForRegex(name)}.*`,
            $options: "i",
          },
        },
      ],
    })
      .where("_id")
      .ne(req.user._id)
      .sort({ name: "asc" });

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
  profile,
  searchUsers,
  createUser,
  updateUser,
  enableUser,
  deleteUser,
};
