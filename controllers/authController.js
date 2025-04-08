const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken");

module.exports.registerUser = async function (req, res) {
  try {
    let { email, password, fullname } = req.body;
    // if any above field is missed out and no. of fields doesn't match with below detals of useModel then the application can crash, that's y we write in try catch to handle the error

    let user = await userModel.findOne({ email: email });
    if (user)
      return res.status(401).send("you already have an account please login");

    bcrypt.genSalt(12, function (err, salt) {
      bcrypt.hash(password, salt, async function (err, hash) {
        if (err) res.send(err.message);
        else {
          let user = await userModel.create({
            fullname,
            email,
            password: hash,
          });

          var token = generateToken(user);
          res.cookie("token", token);
          res.redirect("/shop");
        }
      });
    });
  } catch (err) {
    res.send(err.message);
  }
};

module.exports.loginUser = async function (req, res) {
  let { email, password } = req.body;
  let user = await userModel.findOne({ email: email });
  if (!user) return res.send("email or password incorrect");
  bcrypt.compare(password, user.password, function (err, result) {
    if (result) {
      let token = generateToken(user);
      res.cookie("token", token);
      // res.send("You can login");
      res.redirect("/shop")
    } else {
      return res.send("email or password incorrect");
    }
  });
};

module.exports.logoutUser = function (req, res) {
  res.cookie("token", "");
  res.redirect("/");
};
