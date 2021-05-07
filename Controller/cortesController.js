const CashOut = require("../Model/CashOutModel");
const Sale = require("../Model/SaleModel");
const OtherMovements = require("../Model/OtherMovementModel");
const ServiceModel = require("../Model/ServiceModel");

const errorHandler = require("../Utils/Helpers/errorHandler");

const index = (req, res) => {
  res.render("cortes/cortes", {
    sectionName: "Cortes de caja",
    script: "cortesClient",
    activeMenu: "CRTS",
  });
};

const registerCashOut = async (req, res) => {
  delete req.body._id;
  let { date } = req.body;
  dateOnly = date.split("T");
  date = `${dateOnly[0]}T00:00:00z`;

  let startOfTheDay = date;
  let endOfTheDay = `${dateOnly[0]}T23:59:59z`;

  try {
    let tempCashOut = await CashOut.find({ date });

    if (tempCashOut.length > 0) {
      return res.json({
        error: true,
        message: "Ya existe un corte de caja del día de hoy.",
        response: null,
      });
    }

    let sales = await Sale.find({
      date: { $gte: startOfTheDay, $lte: endOfTheDay },
      canceled: false,
    });

    let otherMovements = await OtherMovements.find({
      date: { $gte: startOfTheDay, $lte: endOfTheDay },
    });

    let services = await ServiceModel.find({
      date: { $gte: startOfTheDay, $lte: endOfTheDay },
    });

    let body = {};

    let totalSales = 0;
    let salida = otherMovements.filter((mov) => mov.type == "Salida de dinero");

    let entrada = otherMovements.filter(
      (mov) => mov.type == "Ingreso de dinero"
    );

    salida.forEach((mov) => {
      totalSales -= mov.amount;
    });

    entrada.forEach((mov) => {
      totalSales += mov.amount;
    });

    sales.forEach((sale) => {
      totalSales += sale.total;
    });

    services.forEach((ser) => {
      totalSales += ser.total;
    });

    let cashOut = await CashOut({
      date: date,
      totalSales,
      salesMade: sales.length + services.length,
      madeBy: req.user._id,
    });

    await cashOut.save();

    res.json({
      error: false,
      message: "El corte de caja agregó correctamente.",
      response: null,
    });
  } catch (error) {
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

const updateCashOut = async (req, res) => {
  const _id = req.body._id;
  delete req.body._id;

  try {
    let cashOut = await CashOut.findById(_id).exec();

    if (!cashOut) {
      res.json({
        error: true,
        message: "No se encontró el corte de caja solicitado.",
        response: null,
      });
      return;
    }

    let startOfTheDay = cashOut.date;
    let endOfTheDay = `${cashOut.date.toISOString().split("T")[0]}T23:59:59z`;

    let sales = await Sale.find({
      date: { $gte: startOfTheDay, $lte: endOfTheDay },
      canceled: false,
    });

    let otherMovements = await OtherMovements.find({
      date: { $gte: startOfTheDay, $lte: endOfTheDay },
    });

    let services = await ServiceModel.find({
      date: { $gte: startOfTheDay, $lte: endOfTheDay },
    });

    let body = {};

    let totalSales = 0;
    let salida = otherMovements.filter((mov) => mov.type == "Salida de dinero");

    let entrada = otherMovements.filter(
      (mov) => mov.type == "Ingreso de dinero"
    );

    salida.forEach((mov) => {
      totalSales -= mov.amount;
    });

    entrada.forEach((mov) => {
      totalSales += mov.amount;
    });

    sales.forEach((sale) => {
      totalSales += sale.total;
    });

    services.forEach((ser) => {
      totalSales += ser.total;
    });
    body = {
      totalSales,
      salesMade: sales.length + services.length,
      updatedBy: req.user._id,
    };

    await CashOut.findByIdAndUpdate(_id, body);

    res.json({
      error: false,
      message: "El corte de caja fue actulizado correctamente.",
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

const searchCashOuts = async (req, res) => {
  let { fechaInicio, fechaFin } = req.body;

  fechaInicio = fechaInicio.split("T");
  fechaInicio = `${fechaInicio[0]}T00:00:00z`;

  fechaFin = fechaFin.split("T");
  fechaFin = `${fechaFin[0]}T23:59:59z`;

  try {
    const cashOuts = await CashOut.find({
      date: { $gte: fechaInicio, $lte: fechaFin },
    }).sort({ date: "asc" });

    res.json({
      error: false,
      message: "",
      response: cashOuts,
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
  registerCashOut,
  updateCashOut,
  searchCashOuts,
};
