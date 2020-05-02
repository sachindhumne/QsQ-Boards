/**
 * Service for user operations.
 */

"use strict";
const mongoose = require("mongoose"),
  bcrypt = require("bcrypt"),
  utilConstants = require("../utils/Constants"),
  User = mongoose.model("Users");

/**
 * Registers a user
 *
 * @param {Object} newUser {user object}
 */
exports.createUser = function (newUser) {
  const hash = bcrypt.hashSync(newUser.password, utilConstants.SALT_ROUNDS);
  newUser.password = hash;
  const user = new User(newUser);
  const promise = user.save();
  return promise;
};

exports.loginUser = function (userObj) {
  const criteria =
    userObj.userName.indexOf("@") === -1
      ? { userName: userObj.userName }
      : { emailId: userObj.userName };
  const promise = User.findOne(criteria).exec();
  return promise;
};

exports.getUserNames = function () {
  const promise = User.find({}, { userName: 1, image: 1, _id: 0 });
  return promise;
};

exports.isUserUnique = function (userObj) {
  const promise = User.find({
    $or: [{ userName: userObj.userName }, { emailId: userObj.emailId }],
  }).exec();
  return promise;
};

exports.updateUser = function (updatedUser, currentUser) {
  const hashPwd = bcrypt.hashSync(
    updatedUser.password,
    utilConstants.SALT_ROUNDS
  );
  const promise = User.findOneAndUpdate({userName:currentUser}, {
    $set: {
      password: hashPwd,
      image: updatedUser.image

    },
  });
  return promise;
};
