const mongoose = require('mongoose')



const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre es requerido'],
        trim: true
    },
    motherSurname: {
        type: String,
        required: [true, 'El apellido materno es requerido.'],
        trim: true,

    },
    fatherSurname: {
        type: String,
        required: [true, 'El apellido paterno es requerido.'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'El correo es requerido'],
        lowercase: true,
        unique: [true, 'Ya existe un usuario con el correo ingresado.']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es requerida.'],
        minlength: [7, 'La contraseña debe tener mínimo 7 letras.']
    },
    picture: {
        type: Buffer
    },
    tokens: [{
        token: {
            type: String,
            required: false
        }
    }]
},{
    timestamps: true
})




const User = mongoose.model('User', userSchema)


module.exports = User







