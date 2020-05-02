"use strict";
module.exports = function (app) {
  const userController = require("../controllers/user-controller"),
    checkAuth = require("../services/auth-service");
  // Route for registering a user
  app
    .route("/v1/users/signup")
    .post(userController.validateUser(), userController.createUser);

  // Route for logging in the registered user
  app.route("/v1/users/login").post(userController.loginUser);

  // Route for updating user details and getting list of registered users
  app
    .route("/v1/users")
    .put(checkAuth, userController.updateUser)
    .get(checkAuth, userController.getUsers);

  app.route('/v1/users/uploadProfileImage')
    .post(userController.upload, userController.uploadRes);

  app.route('/v1/users/profileImg/:filename')
    .get(userController.image);
};
