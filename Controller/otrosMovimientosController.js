const OtherMovement = require("../Model/OtherMovementModel");
const errorHandler = require("../Utils/Helpers/errorHandler");
const moment = require("moment-timezone")

const index = (req, res) => {
  res.render("otrosMovimientos/otrosMovimientos", {
    sectionName: "Otros Movimientos",
    script: "otrosMovimientosClient",
    activeMenu: "OTRMOV",
  });
};

const createOtherMovement = async (req, res) => {
  delete req.body._id;

  req.body.date = new Date(moment.tz("America/Mexico_City").format().split("T")[0]);
  try {
    let otherMovement = OtherMovement(req.body);

    await otherMovement.save();

    res.json({
      error: false,
      message: "El movimiento se agregó correctamente.",
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

const updateOtherMovement = async (req, res) => {
  const _id = req.body._id;
  delete req.body._id;

  try {
    let otherMovement = await OtherMovement.findById(_id).exec();

    if (!otherMovement) {
      res.json({
        error: true,
        message: "No se encontró el movimiento solicitado.",
        response: null,
      });
      return;
    }

    await OtherMovement.findByIdAndUpdate(_id, req.body);

    res.json({
      error: false,
      message: "El movimiento fue actulizado correctamente.",
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

const deleteOtherMovement = async (req, res) => {
  const _id = req.body._id;

  console.log(req.body);
  try {
    let otherMovement = await OtherMovement.findById(_id);

    if (!otherMovement) {
      res.json({
        error: true,
        message: "No se encontró el movimiento solicitado",
        response: null,
      });

      return;
    }

    await otherMovement.deleteOne({ _id });

    res.json({
      error: false,
      message: "El movimiento fue eliminado correctamente.",
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

const searchOtherMovements = async (req, res) => {
  let { fechaInicio, fechaFin } = req.body;

  fechaInicio = fechaInicio.split("T");
  fechaInicio = `${fechaInicio[0]}T00:00:00z`;

  fechaFin = fechaFin.split("T");
  fechaFin = `${fechaFin[0]}T23:59:59z`;

  try {
    const otherMovements = await OtherMovement.find({
      date: { $gte: fechaInicio, $lte: fechaFin },
    }).sort({ date: "asc" });

    res.json({
      error: false,
      message: "",
      response: otherMovements,
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
  createOtherMovement,
  updateOtherMovement,
  deleteOtherMovement,
  searchOtherMovements,
};
