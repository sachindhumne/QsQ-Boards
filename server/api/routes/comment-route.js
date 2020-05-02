/**
 * Comments endpoint route definitions.
 */

"use strict";
module.exports = function (app) {
  const commentsController = require("../controllers/comment-controller"),
    checkAuth = require("../services/auth-service");
  // UserStory Routes for get
  app
    .route("/v1/comments/:taskId")
    .get(checkAuth, commentsController.list);

  app.route("/v1/comments").post(checkAuth, commentsController.create);

  // UserStory Routes for deleting and updating a user story
//   app
//     .route("/v1/user-stories/:storyId")
//     .delete(checkAuth, userStoryController.delete)
//     .put(checkAuth, userStoryController.updateUserStory);

//   app
//     .route("/v1/user-story/:storyId")
//     .get(checkAuth, userStoryController.getUserStory);
};
