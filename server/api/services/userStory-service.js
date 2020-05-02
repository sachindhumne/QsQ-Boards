/**
 * Service for userStory operations.
 */

"use strict";
const mongoose = require("mongoose"),
  UserStory = mongoose.model("UserStories"),
  Project = mongoose.model("Projects"),
  Task = mongoose.model("Tasks"),
  taskService = require("./task-service"),
utilConstants = require("../utils/Constants");

/**
 * Saves and returns the new userStory object.
 *
 * @param {Object} userStory {userStory object}
 */
exports.save = function (userStory) {
  const newUserStory = new UserStory(userStory);
  const promise = newUserStory.save();
  return promise;
};

/**
 * Checks for project Validity
 */
exports.isProjectValid = function (projectId) {
  try {
    const promise = Project.find({_id: projectId}).exec();
    return promise;
  } catch (err) {
    return Promise.reject(new Error(err));
  }
};

/**
 * Returns the list of userStories for the projectId.
 *
 * @param {string} projectId {Id of the project object}
 */
exports.getStories = function (projectId) {
  const promise = new Promise(async function (resolve, reject) {
    await UserStory.aggregate([
      {
        $match: {
          projectId: projectId,
        },
      },
      // Unwind the source
      {
        $unwind: {
          path: "$tasks",
          preserveNullAndEmptyArrays: true,
        },
      },
      // // Do the lookup matching
      {
        $lookup: {
          from: Task.collection.name,
          localField: "tasks",
          foreignField: "_id",
          as: "taskObjects",
        },
      },
      // Unwind the result arrays ( likely one or none )
      {
        $unwind: {
          path: "$taskObjects",
          preserveNullAndEmptyArrays: true,
        },
      },
      // Group back to arrays
      {
        $group: {
          _id: "$_id",
          title: { $first: "$title" },
          description: { $first: "$description" },
          status: { $first: "$status" },
          storyPoints: { $first: "$storyPoints" },
          priority: { $first: "$priority" },
          createdAt: { $first: "$createdAt" },
          tasks: { $push: "$taskObjects" },
        },
      },
      // sorting stage
      { $sort: { createdAt: 1 } },
    ])
      .then((result) => {
        return resolve(result);
      })
      .catch((error) => {
        return reject(error);
      });
  });

  return promise;
};

/**
 * Updates and returns the userStory object.
 *
 * @param {Object} updatedUserStory {userStory object}
 * @param {String} storyId
 */
exports.updateUserStory = function (updatedUserStory, storyId) {
  const promise = UserStory.findOneAndUpdate(
    { _id: storyId },
    updatedUserStory
  ).exec();
  return promise;
};

/**
 * Get and returns the userStory object.
 *
 *  @param {String} storyId
 */
exports.getUserStory = async function (storyId) {
  const promise = UserStory.findOne({ _id: storyId }).populate("tasks").exec();
  return promise;
};

/**
 * Deletes the userStory object matching the id.
 *
 * @param {string} storyId {Id of the Story object}
 */
exports.delete = async function (storyId) {
  try {
    const validUserStory = await UserStory.findOne({ _id: storyId });
    if (validUserStory) {
      // Remove the associated tasks
      removeAssociatedTasks(validUserStory);
      return validUserStory.remove();
    } else {
      return Promise.reject(new Error(utilConstants.FORBIDDEN_ERR));
    }
  } catch (err) {
    return Promise.reject(new Error(utilConstants.FORBIDDEN_ERR));
  }
};

const removeAssociatedTasks = (validUserStory) => {
  validUserStory.tasks.forEach((taskId) => {
    taskService.delete(taskId);
  });
};
