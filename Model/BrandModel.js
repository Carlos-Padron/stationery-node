const mongoose = require('mongoose')

const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre de la marca es requerido'],
        trim : true
    },
    disabled: {
        type: Boolean,
        required: true,
        default: false
    }
},{
    timestamps: true
})

const Brand = mongoose.model('Brand', brandSchema)


module.exports = Brand