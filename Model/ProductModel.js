const mongoose = require("mongoose");

let productSchema = new mongoose.Schema({
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
  barcode: {
    type: String,
    //required: [true, "EL código del barras de producto es requerido"],
    trim: true,
    unique: true,
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
});

//Validator
//*Se trigerea cuando se aurgar un registro
//*Retornar TRUE si es válido
//*Retornar FALSE si no pasa la validación
productSchema.path("barcode").validate(async function (barcode) {
  let existingProduct =
    this.options == null
      ? await mongoose.models.Product.findOne({
          _id: this._id.toString(),
        })
      : await mongoose.models.Product.findOne({
          _id: this.getQuery()._id,
        });

  if (existingProduct) {
    if (existingProduct.barcode === barcode) {
      return true;
    } else {
      let product = await mongoose.models.Product.findOne({ barcode });
      if (product) {
        return false;
      } else {
        return true;
      }
    }
  } else {
    let product = await mongoose.models.Product.find({ barcode });
    if (product.length > 0) {
      return false;
    } else {
      return true;
    }
  }
}, "Ya existe un producto con código de barras ingresado.");

let productModel = new mongoose.model("Product", productSchema);

module.exports = productModel;
