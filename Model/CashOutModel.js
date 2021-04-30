const mongoose = require("mongoose");

const cashOutSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: [true, "La fecha es requerida"],
  },
  totalSales: {
    type: Number,
  },
  salesMade: {
    type: Number,
  },
  madeBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const CashOut = new mongoose.model("CashOut", cashOutSchema);

module.exports = CashOut;
