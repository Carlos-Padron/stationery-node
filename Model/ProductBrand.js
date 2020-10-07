const mongoose = require('mongoose')

const productBrandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    products:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]
})


const ProductBrand = mongoose.model('ProductBrand', productBrandSchema)
