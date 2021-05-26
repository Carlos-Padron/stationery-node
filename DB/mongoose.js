const mongoose = require("mongoose");
let connectionURL =
  process.env.MODE == "PRODUCTION"
    ? process.env.PRODUCTION_DATABASE
    : process.env.DEVELOPMENT_DATABASE;


const mongooseConnection = mongoose
  .connect(connectionURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .catch((err) => {
    console.error("error connection to the database:");
    console.error(err);
  });

module.exports = mongooseConnection;
