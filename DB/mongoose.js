const mongoose = require("mongoose");
const connectionURL = process.env.DATABASE;

const mongooseConnection = mongoose.connect(connectionURL, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

module.exports = mongooseConnection;
