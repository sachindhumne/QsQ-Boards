/**
 * Project endpoint route definitions.
 */

"use strict";
module.exports = function (app) {
  const projectController = require("../controllers/project-controller"),
    checkAuth = require("../services/auth-service");
  // Project Routes for search and create.
  app
    .route("/v1/projects")
    .get(checkAuth, projectController.list)
    .post(checkAuth, projectController.post);

  // Project Routes for get, update and delete.
  app
    .route("/v1/projects/:projectId")
    .get(checkAuth, projectController.get)
    .put(checkAuth, projectController.put)
    .delete(checkAuth, projectController.delete);
};
