const mongoose = require('mongoose')
const connectionURL = 'mongodb://127.0.0.1:27017/papeleria-ricar2'

const mongooseConnection = mongoose.connect(connectionURL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})


module.exports = mongooseConnection

