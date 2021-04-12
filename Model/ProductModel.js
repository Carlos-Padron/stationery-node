const mongoose = require("mongoose");

let productSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      auto: true,
    },
    name: {
      type: String,
      required: [true, "El nombre del producto es requerido"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "EL precio del producto es requerido"],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, "La cantidad total del producto es requerida"],
      trim: true,
    },
    disabled: {
      type: Boolean,
      default: false,
      required: true,
    },
    imageAbsolutePath: {
      type: String,
    },
    imageRelativePath: {
      type: String,
    },
    articleType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ArticleType",
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },
    history: [
      {
        date: {
          type: Date,
        },
        quantity: {
          type: Number,
        },
        action: {
          type: String,
        },
        description: {
          type: String,
        },
        madeBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
  }
);

let productModel = new mongoose.model("Product", productSchema);

module.exports = productModel;
