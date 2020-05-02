/**
 * UserStory endpoint route definitions.
 */

"use strict";
module.exports = function (app) {
  const userStoryController = require("../controllers/userStory-controller"),
    checkAuth = require("../services/auth-service");
  // UserStory Routes for get
  app
    .route("/v1/user-stories/:projectId")
    .get(checkAuth, userStoryController.list);

  app.route("/v1/user-stories").post(checkAuth, userStoryController.create)

  // UserStory Routes for deleting and updating a user story
  app
    .route("/v1/user-stories/:storyId")
    .delete(checkAuth, userStoryController.delete)
    .put(checkAuth, userStoryController.updateUserStory);

  app
    .route("/v1/user-story/:storyId")
    .get(checkAuth, userStoryController.getUserStory);
};
