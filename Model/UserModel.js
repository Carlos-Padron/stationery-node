const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

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
        required: true,
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
    }
}, {
    timestamps: true
})


userSchema.methods.toJSON = function () {
    const user = this
    const userObj = user.toObject()

    delete userObj.password
    delete userObj.createdAt
    delete userObj.updatedAt

    return userObj
}

//Validator
//*Retornar TRUE si es válido
//*Retornar FALSE si no pasa la validación
userSchema.path('email').validate(async function (email) {
    let existingUser = await mongoose.models.User.findOne({ _id: this._id.toString() })

    if (existingUser) {
        if (existingUser.email === email) {
            return true
        } else {
            let email = await mongoose.models.User.findOne({ email })
                (email) ? false : true
        }
    } else {
        let user = await mongoose.models.User.find({ email })
            (user.length > 0) ? false : true
    }
}, 'Ya existe una cuenta con el correo ingresado.')


//Hooks
userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10)
    }
    next()

})

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.SECRET_KEY)

    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error("No se encontró al usuario con el correo ingresado.")
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Constraseña incorrecta.')
    }
    return user
}


const User = mongoose.model('User', userSchema)


module.exports = User







