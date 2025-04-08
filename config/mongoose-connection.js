// ()
const mongoose = require("mongoose");

const dbgr = require("debug")("development:mongoose");

mongoose
  .connect("mongodb+srv://scatch:<db_password>@cluster0.63y4few.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(function () {
    dbgr("connected");
  })
  .catch(function (err) {
    dbgr(err);
  });

module.exports = mongoose.connection;
