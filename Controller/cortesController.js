const CashOut = require("../Model/CashOutModel");
const Sale = require("../Model/SaleModel");

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

  let initialDate = date;
  let finalDate = `${dateOnly[0]}T23:59:59z`;

  try {

    let tempCashOut = await CashOut.find({date})

    if (tempCashOut.length > 0) {
      return res.json({
        error: true,
        message: "Ya existe un corte de caja del día de hoy.",
        response: null,
      });
    }


    let sales = await Sale.find({
      date: { $gte: initialDate, $lte: finalDate },
      canceled: false,
    });

    if (sales.length == 0) {
      //No hay ventas
      let cashOut = await CashOut({
        date: date,
        totalSales: 0,
        salesMade: 0,
        madeBy: req.user._id,
      });

      await cashOut.save();
    } else {
      console.log(sales);
      let totalSales = 0;
      sales.forEach((sale) => {
        console.log(sale.total);
        totalSales += sale.total;
      });

      let cashOut = await CashOut({
        date: date,
        totalSales,
        salesMade: sales.length,
        madeBy: req.user._id,
      });

      await cashOut.save();
    }

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

    console.log(cashOut.date);
    let sales = await Sale.find({
      date: { $gte: cashOut.date, $lte: cashOut.date },
      canceled: false,
    });

    let body = {};
    if (sales.length == 0) {
      //No hay ventas
      body = {
        totalSales: 0,
        salesMade: 0,
        updatedBy: req.user._id,
      };
    } else {
      let totalSales = 0;
      sales.forEach((sale) => {
        totalSales += sale.total;
      });

      body = {
        totalSales,
        salesMade: sales.length,
        updatedBy: req.user._id,
      };
    }

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
