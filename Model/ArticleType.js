const mongoose = require('mongoose')

const articleTypeSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'El nombre del tipo de artículo es requerido'],
        trim: true
    },
    disabled: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true
})

const ArticleType = new mongoose.model('ArticleType', articleTypeSchema)

module.exports = ArticleType