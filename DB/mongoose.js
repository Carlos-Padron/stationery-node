const mongoose = require("mongoose");
const connectionURL = process.env.DATABASE;

const mongooseConnection = mongoose
  .connect(connectionURL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .catch((err) => {
    console.error("error connection to the database:");
    console.error(err);
  });

module.exports = mongooseConnection;
