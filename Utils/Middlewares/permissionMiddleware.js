const isAdminForViews = async (req, res, next) => {
  if (req.user.role == "admin") {
    next();
  } else {
    return res.redirect("/dashboard");
  }
};

//Verifica si se está autenticado para hacer la solicitud
const isAdminForRoutes = async (req, res, next) => {
  if (req.user.role == "admin") {
    next();
  } else {
    return res.json({
      error: true,
      message:
        "No se puedo realizar la operacion por que el usuario no cuenta con los permisos requeridos..",
      response: null,
    });
  }
};

module.exports = {
  isAdminForViews,
  isAdminForRoutes,
};
