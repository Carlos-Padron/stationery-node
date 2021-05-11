const ServiceModel = require("../Model/ServiceModel");
const errorHandler = require("../Utils/Helpers/errorHandler");

const index = (req, res) => {
  res.render("servicios/servicios", {
    sectionName: "Servicios",
    script: "serviciosClient",
    activeMenu: "SRVCO",
  });
};

const createService = async (req, res) => {
  delete req.body._id;

  req.body.date = new Date();
  try {
    let service = ServiceModel(req.body);

    await service.save();

    res.json({
      error: false,
      message: "El servicio se agregó correctamente.",
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

const updateService = async (req, res) => {
  const _id = req.body._id;
  delete req.body._id;

  try {
    let service = await ServiceModel.findById(_id).exec();

    if (!service) {
      res.json({
        error: true,
        message: "No se encontró el servicio solicitado.",
        response: null,
      });
      return;
    }

    await ServiceModel.findByIdAndUpdate(_id, req.body);

    res.json({
      error: false,
      message: "El servicio fue actulizado correctamente.",
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

const deleteService = async (req, res) => {
  const _id = req.body._id;

  try {
    let service = await ServiceModel.findById(_id);

    if (!service) {
      res.json({
        error: true,
        message: "No se encontró el servicio solicitado",
        response: null,
      });

      return;
    }

    await ServiceModel.deleteOne({ _id });

    res.json({
      error: false,
      message: "El servicio fue eliminado correctamente.",
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

const searchServices = async (req, res) => {
  let { fechaInicio, fechaFin } = req.body;

  fechaInicio = fechaInicio.split("T");
  fechaInicio = `${fechaInicio[0]}T00:00:00z`;

  fechaFin = fechaFin.split("T");
  fechaFin = `${fechaFin[0]}T23:59:59z`;

  try {
    const services = await ServiceModel.find({
      date: { $gte: fechaFin, $lte: fechaInicio },
    }).sort({ date: "asc" });

    res.json({
      error: false,
      message: "",
      response: services,
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
  createService,
  updateService,
  deleteService,
  searchServices,
};
