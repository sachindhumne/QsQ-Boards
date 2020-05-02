/**
 * Service for comments operations.
 */

"use strict";
const mongoose = require("mongoose"),
      User = mongoose.model("Users"), 
      Comment = mongoose.model("Comments");
/**
 * Returns an array of comments object matching the search parameters.
 *
 * @param {Object} params {Search parameters}
 */
exports.search = function (taskId) {
  const promise = Comment.find({ taskId: taskId }).sort({createdAt: -1}).exec();
  return promise;
};

/**
 * Saves and returns the new comment object.
 *
 * @param {Object} comment {comment object}
 */
exports.save = async function (newComment, loggedUserName) {
    const authorInfo = await generateAuthorObj(loggedUserName);
    newComment.author = {
        userName: authorInfo.userName,
        image: authorInfo.image
    }
    const createdComment = new Comment(newComment);
    const promise = createdComment.save();
    return promise;
  };

  const generateAuthorObj = (author) => {
    const promise = User.findOne(
      { userName: author },
      { userName: 1, image: 1, _id: 0 }
    ).exec();
    return promise;
  };