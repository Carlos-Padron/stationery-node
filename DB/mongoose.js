const mongoose = require("mongoose");
let connectionURL;

if (process.env.MODE == "PRODUCTION") {
  connectionURL = process.env.PRODUCTION_DATABASE;
}else{
  connectionURL = process.env.DEVELOPMENT_DATABASE;

}

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
