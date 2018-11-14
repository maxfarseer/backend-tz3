import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import config from "../../config";

const User = new mongoose.Schema({
  type: { type: String, default: "User" },
  username: { type: String, required: true, unique: true },
  displayName: { type: String },
  googleId: { type: String },
  password: { type: String }
});

User.pre("save", function preSave(next) {
  const user = this;

  if (!user.isModified("password")) {
    return next();
  }

  new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        return reject(err);
      }
      resolve(salt);
    });
  })
    .then(salt => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) {
          throw new Error(err);
        }

        user.password = hash;

        next(null);
      });
    })
    .catch(err => next(err));
});

User.methods.validatePassword = function validatePassword(password) {
  const user = this;

  return new Promise((resolve, reject) => {
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return reject(err);
      }

      resolve(isMatch);
    });
  });
};

User.methods.generateToken = function generateToken() {
  const user = this;
  return jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      id: user.id
    },
    config.token
  );
};

export default mongoose.model("user", User, "user");
