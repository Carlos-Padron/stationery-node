const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "El nombre es requerido"],
    trim: true,
  },
  motherSurname: {
    type: String,
    required: [true, "El apellido materno es requerido."],
    trim: true,
  },
  fatherSurname: {
    type: String,
    required: [true, "El apellido paterno es requerido."],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "El email es requerido."],
    lowercase: true,
    unique: true,
  },
  role: {
    type: String,
    default: "employee",
  },
  password: {
    type: String,
    required: [true, "La contraseña es requerida."],
    minlength: [7, "La contraseña debe tener mínimo 7 letras."],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  imageAbsolutePath: {
    type: String,
  },
  imageRelativePath: {
    type: String,
  },
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObj = user.toObject();

  delete userObj.password;
  delete userObj.createdAt;
  delete userObj.updatedAt;

  return userObj;
};

//Validator
//*Se trigerea cuando se aurgar un registro
//*Retornar TRUE si es válido
//*Retornar FALSE si no pasa la validación
userSchema.path("email").validate(async function (email) {
  let existingUser =
    this.options == null
      ? await mongoose.models.User.findOne({
          _id: this._id.toString(),
        })
      : await mongoose.models.User.findOne({
          _id: this.getQuery()._id,
        });

  //console.log(existingUser);
  if (existingUser) {
    console.log(existingUser.email);
    if (existingUser.email === email) {
      return true;
    } else {
      let userEmail = await mongoose.models.User.findOne({ email });
      if (userEmail) {
        return false;
      } else {
        return true;
      }
    }
  } else {
    let u = await mongoose.models.User.find({ email });
    if (u.length > 0) {
      return false;
    } else {
      return true;
    }
  }
}, "Ya existe una cuenta con el correo ingresado.");

//Hooks
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(
      user.password,
      parseInt(process.env.BCRYPT_ROUNDS)
    );
  }

  next();
});

userSchema.pre("findOneAndUpdate", async function (next) {
  const user = this;

  if (user._update.password) {
    user._update.password = await bcrypt.hash(
      user._update.password,
      parseInt(process.env.BCRYPT_ROUNDS)
    );
  }
  next();
});

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.SECRET_KEY);

  return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email, disabled: false });

  if (!user) {
    throw new Error("No se encontró al usuario con el correo ingresado.");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Constraseña incorrecta.");
  }

  return user;
};

userSchema.methods.generatePasswordRecoveryToken = async function () {
  const user = this;

  let randomString = crypto.randomBytes(64).toString("hex");
  let token = jwt.sign(
    { _id: user._id.toString(), token: randomString },
    process.env.SECRET_KEY,
    {
      expiresIn: "1h",
    }
  );

  return token;
};

userSchema.statics.findUserByEmail = async (email) => {
  const user = await User.findOne({ email, disabled: false });

  if (!user) {
    throw new Error("No se encontró al usuario con el correo ingresado.");
  }

  return user;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
