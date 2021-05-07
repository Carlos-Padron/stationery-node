const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, "La descripción es requerida"],
    trim: true,
  },
  total: {
    type: Number,
    required: [true, "La cantidad es requerida"],
  },
  date: {
    type: Date,
  },
});

const Service = new mongoose.model("Service", serviceSchema);

module.exports = Service;
