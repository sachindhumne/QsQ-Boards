/**
 * Service for Task operations.
 */

"use strict";
const mongoose = require("mongoose"),
  UserStory = mongoose.model("UserStories"),
  Task = mongoose.model("Tasks"),
  Comment = mongoose.model("Comments"),
  utilConstants = require("../utils/Constants");

/**
 * Checks for user Story Validity
 */
exports.isUserStoryValid = function (storyId) {
  try {
    const promise = UserStory.find({
      _id: storyId,
    }).exec();
    return promise;
  } catch (err) {
    return Promise.reject(new Error(err));
  }
};

/**
 * Saves and returns the new task object.
 *
 * @param {Object} taskObj {task object}
 */
exports.save = function (taskObj) {
  const newTask = new Task(taskObj);
  const promise = newTask.save();
  return promise;
};

/**
 * Updates the user story tasks array with the added task
 *  @param {Object} taskId {task Id}
 * @param {Object} storyId {userStory Id}
 */
exports.updateUserStory = async function (taskId, storyId, isTaskAdded) {
  try {
    const userStory = await UserStory.findOne({ _id: storyId });
    if (userStory && isTaskAdded) {
      userStory.tasks.push(taskId);
      return userStory.update(userStory);
    } else if (userStory && !isTaskAdded) {
      userStory.tasks.pull(taskId);
      return userStory.update(userStory);
    } else {
      return Promise.reject(new Error(utilConstants.NOT_FOUND));
    }
  } catch (err) {
    return Promise.reject(new Error(utilConstants.NOT_FOUND));
  }
};

/**
 * Updates and returns the Task object.
 * @param {Object} userStory {Task object}
 * @param {String} taskId
 */
exports.updateTask = function (updatedTask, taskId) {
  const promise = Task.findOneAndUpdate({ _id: taskId }, updatedTask).exec();
  return promise;
};

exports.getAssociatedStoryId = function (taskId) {
  const promise = UserStory.findOne({ tasks: taskId }).exec();
  return promise;
}

const removeComments = (validTask) => {
  const promise = Comment.remove({taskId: validTask._id}).exec();
  return promise;
}

/**
 * Deletes the Task object matching the taskId.
 *
 * @param {string} taskId {Id of the task object}
 */
exports.delete = async function (taskId) {
  try {
    const validTask = await Task.findOne({ _id: taskId });
    if (validTask) {
      // Remove associate taskComments if any
      const commentsPromise = await removeComments(validTask);
      if(commentsPromise) {
      return validTask.remove();
      }
    } else {
      return Promise.reject(new Error(utilConstants.FORBIDDEN_ERR));
    }
  } catch (err) {
    return Promise.reject(new Error(utilConstants.FORBIDDEN_ERR));
  }
};

/**
 * Returns the list of tasks assigned to the user
 * 
 * @param {string} userName {user name of the user}
 */
exports.getUserTasks = function (userName) {
  const promise = Task.find({"assignee.userName":userName}).exec();
  return promise;
};


