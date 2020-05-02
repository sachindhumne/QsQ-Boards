"use strict";
//import project service.
const projectService = require("../services/project-service"),
  utilConstants = require("../utils/Constants"),
  log4js = require("log4js");
log4js.configure({
  appenders: {
    everything: { type: "file", filename: "logs/qsqBoard.log" },
  },
  categories: {
    default: { appenders: ["everything"], level: "debug" },
  },
});
const logger = log4js.getLogger("qsqBoard");

/**
 * Returns a list of projects in JSON based on the
 * search parameters.
 *
 * @param {request} {HTTP request object}
 * @param {response} {HTTP response object}
 */
exports.list = function (request, response) {
  const resolve = (projects) => {
    response.status(200);
    response.json(projects);
  };
  const loggedInUser = request.userData.userName;
  projectService
    .search(loggedInUser)
    .then(resolve)
    .catch(renderErrorResponse(response));
};

/**
 * Creates a new project with the request JSON and
 * returns project JSON object.
 *
 * @param {request} {HTTP request object}
 * @param {response} {HTTP response object}
 */
exports.post = function (request, response) {
  try {
    const newProject = Object.assign({}, request.body);
    newProject.owner = request.userData.userName;
    const resolve = (newProject) => {
      response.status(201).json(newProject);
    };
    projectService
      .save(newProject)
      .then(resolve)
      .catch(renderErrorResponse(response));
  } catch (err) {
    renderErrorResponse(err);
  }
};

/**
 * Building Custom Project Object
 */
const buildCustomProj = (project, ownerInfo, memberInfo) => {
  // build custom response object
  const projectResp = {
    _id: project._id,
    title: project.title,
    description: project.description,
    owner: ownerInfo,
    members: memberInfo,
    status: project.status,
  };
  return projectResp;
};

/**
 * custom async foreach function
 */
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

/**
 * Returns a project object in JSON.
 *
 * @param {request} {HTTP request object}
 * @param {response} {HTTP response object}
 */
exports.get = function (request, response) {
  const resolve = (project) => {
    if (project) {
      // make owner field to contain username and image
      projectService
        .getOwnerInfo(project.owner)
        .then(async (ownerInfo) => {
          if (ownerInfo) {
            // get members info
            if (project.members.length > 0) {
              let memberCustomArr = [];
              await asyncForEach(project.members, async (member) => {
                const memberInfo = await projectService.getOwnerInfo(member);
                memberCustomArr.push(memberInfo);
              });

              const projectResp = buildCustomProj(
                project,
                ownerInfo,
                memberCustomArr
              );
              response.status(200);
              response.json(projectResp);
            } else {
              const projectResp = buildCustomProj(
                project,
                ownerInfo,
                project.members
              );
              response.status(200);
              response.json(projectResp);
            }
          } else {
            response.status(400);
            logger.warn(`Client error: ${error.message}`);
            response.json({
              message: utilConstants.CLIENT_ERR,
            });
          }
        })
        .catch(renderErrorResponse(response));
    } else {
      response.status(404).json();
    }
  };
  projectService
    .get(request.params.projectId)
    .then(resolve)
    .catch(renderErrorResponse(response));
};

/**
 * Updates and returns a project object in JSON.
 *
 * @param {request} {HTTP request object}
 * @param {response} {HTTP response object}
 */
exports.put = function (request, response) {
  const project = Object.assign({}, request.body);
  const resolve = () => {
    response.status(200).json();
  };
  project._id = request.params.projectId;
  projectService
    .update(project, request.userData.userName)
    .then(resolve)
    .catch(renderErrorResponse(response));
};

/**
 * Deletes a project object.
 *
 * @param {request} {HTTP request object}
 * @param {response} {HTTP response object}
 */
exports.delete = function (request, response) {
  const resolve = () => {
    response.status(200).json();
  };
  projectService
    .delete(request.params.projectId, request.userData.userName)
    .then(resolve)
    .catch(renderErrorResponse(response));
};
/**
 * Throws error if error object is present.
 *
 * @param {Response} response The response object
 * @return {Function} The error handler function.
 */
let renderErrorResponse = (response) => {
  const errorCallback = (error) => {
    if (error && error.message === utilConstants.FORBIDDEN_ERR) {
      response.status(403).json({
        message: utilConstants.FORBIDDEN_ERR,
      });
    } else if (error && error.name === utilConstants.VALIDATION_ERR) {
      response.status(400);
      logger.warn(`Client error: ${error.message}`);
      response.json({
        message: utilConstants.CLIENT_ERR,
      });
    } else if (error && error.message === utilConstants.NOT_FOUND) {
      response.status(404);
      logger.warn(`Client Input error: ${error.message}`);
      response.json({
        message: utilConstants.NOT_FOUND,
      });
    } else {
      response.status(500);
      logger.fatal(`Server error: ${error.message}`);
      response.json({
        message: utilConstants.SERVER_ERR,
      });
    }
  };
  return errorCallback;
};
