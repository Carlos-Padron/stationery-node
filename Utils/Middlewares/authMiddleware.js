const jwt = require("jsonwebtoken");
const User = require("../../Model/UserModel");
const { redisGet } = require("../Helpers/redisHelper");

//Valida que se tenga la cookie con el token para validar lais vistas
const authViews = async (req, res, next) => {
  try {

    if (req.sessionID) {
      console.log(req.sessionID)
      let cookie = await redisGet(`sess:${req.sessionID}`);
      console.log(cookie)

      if (!cookie) {
        return res.redirect("/login");
      }

      let token = JSON.parse(cookie).key;

      let userID = jwt.verify(token, process.env.SECRET_KEY);
      let user = await User.findById(userID);

      if (user) {
        req.user = user;

        next();
      } else {
        return res.redirect("/login?code=403");
      }
    } else {
      return res.redirect("/login?code=401");
    }
  } catch (error) {
    return res.redirect("/login?code=500");
  }
};

//Si se está logueado y se trata de ingresar al login, se redirigue al dashboard
const redirectIfAuth = async (req, res, next) => {
  try {
    if (req.sessionID) {
      let cookie = await redisGet(`sess:${req.sessionID}`);

      if (cookie) {
        let token = JSON.parse(cookie).key;

        let userID = jwt.verify(token, process.env.SECRET_KEY);
        let user = await User.findById(userID);

        if (user) {
          return res.redirect("/dashboard");
        } else {
          return res.redirect("/login");
        }
      }

      next();
    }
  } catch (error) {
    console.error(error);
    return res.redirect("/login");
  }
};

//Verifica si se está autenticado para hacer la solicitud
const authRoute = async (req, res, next) => {
  try {
    if (req.sessionID) {
      let cookie = await redisGet(`sess:${req.sessionID}`);

      if (cookie) {
        let token = JSON.parse(cookie).key;

        let userID = jwt.verify(token, process.env.SECRET_KEY);
        let user = await User.findById(userID);

        if (user) {
          req.user = user;

          next();
          return;
        } else {
          return res.json({
            error: true,
            message:
              "No se puedo verificar el usuario autenticado. Por favor vuelve a iniciar sesión.",
            response: null,
          });
        }
      } else {
        return res.json({
          error: true,
          message:
            "No se puedo verificar el usuario autenticado. Por favor vuelve a iniciar sesión.",
          response: null,
        });
      }
    } else {
      return res.json({
        error: true,
        message:
          "No se puedo verificar el usuario autenticado. Por favor vuelve a iniciar sesión.",
        response: null,
      });
    }
  } catch (error) {
    console.error(error);
    return res.json({
      error: true,
      message: "No se puedo verificar el usuario autenticado.",
      response: null,
    });
  }
};

//Verifica si el token es válido
const validTokenForChangingThPW = async (req, res, next) => {
  try {
    
    let token = req.body.token;
    if (token) {
      let payload = jwt.verify(token, process.env.SECRET_KEY);

      let user = await User.findById(payload._id);

      if (user) {
        req.user = user;

        next();
        return;
      } else {
        return res.json({
          error: true,
          message: "No se puedo verificar el usuario que desea el cambio.",
          response: null,
        });
      }
    } else {
      return res.json({
        error: true,
        message: "No se pudo verficiar el token.",
        response: null,
      });
    }
  } catch (error) {
    console.error(error);
    return res.json({
      error: true,
      message:
        "El token ha expirado, para cambiar la contraseña vuelva a enviar el correo.",
      response: null,
    });
  }
};

module.exports = {
  authViews,
  redirectIfAuth,
  authRoute,
  validTokenForChangingThPW
};
