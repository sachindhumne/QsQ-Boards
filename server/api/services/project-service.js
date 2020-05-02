/**
 * Service for project operations.
 */

"use strict";
const mongoose = require("mongoose"),
  Project = mongoose.model("Projects"),
  UserStory = mongoose.model("UserStories"),
  User = mongoose.model("Users"),
  utilConstants = require("../utils/Constants"),
  storyService = require("./userStory-service");
/**
 * Returns an array of project object matching the search parameters.
 *
 * @param {Object} params {Search parameters}
 */
exports.search = function (userName) {
  const promise = Project.find({
    $or: [{ owner: userName }, { members: userName }],
  }).exec();
  return promise;
};

/**
 * Saves and returns the new project object.
 *
 * @param {Object} project {project object}
 */
exports.save = function (project) {
  const newProject = new Project(project);
  const promise = newProject.save();
  return promise;
};

/**
 * Returns the project object matching the id.
 *
 * @param {string} projectId {Id of the project object}
 */
exports.get = async function (projectId) {
  try {
    const promise = await Project.findOne({ _id: projectId });
    if (promise) {
      return promise;
    } else {
      return Promise.reject(new Error(utilConstants.NOT_FOUND));
    }
  } catch (err) {
    return Promise.reject(new Error(utilConstants.NOT_FOUND));
  }
};

const generateOwnerObj = (owner) => {
  const promise = User.findOne(
    { userName: owner },
    { userName: 1, image: 1, _id: 0 }
  ).exec();
  return promise;
};

/**
 * Returns owner info with image
 */
exports.getOwnerInfo = function (owner) {
  return generateOwnerObj(owner);
};

/**
 * Updates and returns the project object.
 *
 * @param {Object} project {project object}
 */
exports.update = async function (project, userName) {
  try {
    const validProject = await Project.findOne({ _id: project._id });

    if (validProject && validProject.owner === userName) {
      project.modifiedDate = new Date();
      return validProject.update(project);
    } else {
      return Promise.reject(new Error(utilConstants.FORBIDDEN_ERR));
    }
  } catch (err) {
    return Promise.reject(new Error(utilConstants.FORBIDDEN_ERR));
  }
};

/**
 * Deletes the project object matching the id.
 *
 * @param {string} projectId {Id of the project object}
 */
exports.delete = async function (projectId, userName) {
  try {
    const validProject = await Project.findOne({ _id: projectId });
    if (validProject && validProject.owner === userName) {
      // Remove Associations
      removeAssociatedStories(projectId);
      return validProject.remove();
    } else {
      return Promise.reject(new Error(utilConstants.FORBIDDEN_ERR));
    }
  } catch (err) {
    return Promise.reject(new Error(utilConstants.FORBIDDEN_ERR));
  }
};

const removeAssociatedStories = (projectId) => {
  UserStory.find({projectId: projectId}).exec((err,userStories) => {
    if(!err) {
    userStories.forEach((userStory) => {
        storyService.delete(userStory._id);
    })
  }
  })
}
