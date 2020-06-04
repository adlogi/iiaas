/***************************/
/** Database Functionality */
/***************************/

(function() {
  const mongoose = require("mongoose");
  const Schema = mongoose.Schema;
  const KEY_LENGTH = 10;
  let User;
  
  // Call this function first to initiate connection to the database.
  module.exports.init = function () {
    mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    const userSchema = new Schema({
      email: { type: String, required: true },
      password: { type: String, required: true },
      key: { type: String, required: true },
      integer: Number
    });
    User = mongoose.model("User", userSchema);
  }

  module.exports.createUser = function (email, password, done) {
    const user = new User({
      email: email,
      password: password,
      key: generateKey(KEY_LENGTH),
      integer: 0
    });
    user.save(function(err, data) {
      if (err) return done(err);
      done(null, data);
    });
  };

  module.exports.findUserByEmail = function (email, done) {
    User.findOne({ email: email }, (err, userFound) => {
      if (err) return done(err);
      done(null, userFound);
    });
  };

  // element is an object, e.g. {email: 'user@example.com'}
  module.exports.findUser = function (element, done) {
    User.findOne(element, (err, userFound) => {
      if (err) return done(err);
      done(null, userFound);
    });
  };

  module.exports.incrementInteger = function (key, done) {
    User.findOneAndUpdate(
      { key: key },
      { $inc: { integer: 1 } },
      { new: true, useFindAndModify: false },
      (err, data) => {
        if (err) return done(err);
        done(null, data);
      }
    );
  };

  module.exports.setInteger = function (key, value, done) {
    User.findOneAndUpdate(
      { key: key },
      { $set: { integer: value } },
      { new: true, useFindAndModify: false },
      (err, data) => {
        if (err) return done(err);
        done(null, data);
      }
    );
  };

  function generateKey(length) {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }
}());
