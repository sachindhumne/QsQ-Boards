"use strict";
//import task service.
const taskService = require("../services/task-service"),
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
 * Creates a new task with the request JSON and
 * returns success response.
 *
 * @param {request} {HTTP request object}
 * @param {response} {HTTP response object}
 */
exports.create = function (request, response) {
  try {
    const newTask = Object.assign({}, request.body);
    const resolve = (task) => {
      // add the created task id to userStory tasks array
      taskService
        .updateUserStory(task._id, request.body.storyId, true)
        .then((userStory) => {
          if (userStory) {
            response.status(201).json(task);
          } else {
            response.status(400).json({
              message: utilConstants.CLIENT_ERR,
            });
          }
        });
    };
    // check if userStory exists
    taskService
      .isUserStoryValid(request.body.storyId)
      .then((userStory) => {
        if (userStory.length > 0) {
          taskService
            .save(newTask)
            .then(resolve)
            .catch(renderErrorResponse(response));
        } else {
          response.status(404).json({
            message: "User Story not found",
          });
        }
      })
      .catch((err) => {
        logger.warn(err.message);
        response.status(404).json({
          message: "User Story not found",
        });
      });
  } catch (err) {
    renderErrorResponse(err);
  }
};

/**
 * Deletes a Task object.
 *
 * @param {request} {HTTP request object}
 * @param {response} {HTTP response object}
 */
exports.delete = function (request, response) {
  const resolve = (task) => {
    if (task) {
      taskService.getAssociatedStoryId(task._id).then((userStory) => {
        const storyId = userStory._id;
        taskService
          .updateUserStory(task._id, storyId, false)
          .then((userStory) => {
            if (userStory) {
              response.status(200).json();
            } else {
              response.status(400).json({
                message: utilConstants.CLIENT_ERR,
              });
            }
          })
          .catch(renderErrorResponse(response));
      })
        .catch(renderErrorResponse(response));
    } else {
      response.status(400).json({
        message: utilConstants.CLIENT_ERR,
      });
    }
  };
  taskService
    .delete(request.params.taskId)
    .then(resolve)
    .catch(renderErrorResponse(response));
};

/**
 * Returns Updated Task response.
 *
 * @param request
 * @param response
 */
exports.updateTask = (request, response) => {
  try {
    const updatedTask = Object.assign({}, request.body);
    const resolve = (updatedTask) => {
      if (updatedTask) {
        response.status(200).json();
      } else {
        response.status(400).json({
          message: "Update failed"
        })
      }
    };
    taskService
      .updateTask(updatedTask, request.params.taskId)
      .then(resolve)
      .catch(renderErrorResponse(response));
  } catch (err) {
    renderErrorResponse(err);
  }
};

exports.getUserTasks = (request, response) => {
  const userName = request.userData.userName;
  try{
    const resolve = (tasks) => {
      response.status(200);
      response.json(tasks);
    };
    taskService
      .getUserTasks(userName)
      .then(resolve)
      .catch(renderErrorResponse(response));
  }catch(err){
    renderErrorResponse(err)
  }
}

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
