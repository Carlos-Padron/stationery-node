const User = require("../Model/UserModel");

const index = (req, res) => {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");

  res.render("login", {
    script: "loginClient",
  });
};

const logInUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();

    req.session.key = token;

    console.log(req.session);
    return res.json({
      error: false,
      message: "Acceso correcto.",
      response: {
        user,
        token,
      },
    });
  } catch (error) {
    console.log(error.message);
    return res.json({
      error: true,
      message: error.message,
      response: null,
    });
  }
};

const logOutUser = async (req, res) => {};

module.exports = {
  index,
  logInUser,
  logOutUser,
};
