const mongoose = require("mongoose");

const lossSchema = new mongoose.Schema(
  {
    productID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "El producto es requerido"],
      trim: true,
    },
    quantity: {
      type: Number,
    },
    unitPrice: {
      type: Number,
    },
    madeBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    date: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const LossModel = new mongoose.model("Loss", lossSchema);

module.exports = LossModel;
