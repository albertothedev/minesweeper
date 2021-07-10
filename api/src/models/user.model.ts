import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import { UserDoc } from "../types/index";

const Schema = mongoose.Schema;

const userSchema = new Schema<UserDoc>({
  username: String,
  password: String,
});

userSchema.pre<UserDoc>("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  if (this.password) this.password = bcrypt.hashSync(this.password, 10);

  next();
});

userSchema.methods.validatePassword = function (plaintext: string, callback: Function) {
  return callback(null, bcrypt.compareSync(plaintext, this.password));
};

const User = mongoose.model("User", userSchema, "users");

module.exports = User;
