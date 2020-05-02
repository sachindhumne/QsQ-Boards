"use strict";
//import comments service.
const commentService = require("../services/comment-service"),
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
 * Returns a list of comments in JSON based on the
 * search parameters.
 *
 * @param {request} {HTTP request object}
 * @param {response} {HTTP response object}
 */
exports.list = function (request, response) {
  const resolve = (comments) => {
    response.status(200);
    response.json(comments);
  };
  commentService
    .search(request.params.taskId)
    .then(resolve)
    .catch(renderErrorResponse(response));
};

/**
 * Creates a new comment with the request JSON and
 * returns comment JSON object.
 *
 * @param {request} {HTTP request object}
 * @param {response} {HTTP response object}
 */
exports.create = function (request, response) {
  try {
    const newComment = Object.assign({}, request.body);
    const loggedInUserName = request.userData.userName;
    const resolve = (newComment) => {
      response.status(201).json(newComment);
    };
    commentService
      .save(newComment, loggedInUserName)
      .then(resolve)
      .catch(renderErrorResponse(response));
  } catch (err) {
    renderErrorResponse(err);
  }
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
