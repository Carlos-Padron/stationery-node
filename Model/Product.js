const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductBrand'
    },
    quantity: {
        type: Number,
        required: true
    },
    image:{
        type: Buffer,
    }
})





const Product = mongoose.model('Product', ProductSchema)



module.exports = Product