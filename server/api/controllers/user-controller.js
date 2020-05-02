"use strict";
//import user service.
const userService = require("../services/user-service");
const multer = require('multer');
const fs = require('fs');
const { check, validationResult } = require("express-validator"),
  utilConstants = require("../utils/Constants"),
  bcrypt = require("bcrypt"),
  jwt = require("jsonwebtoken"),
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

exports.validateUser = () => {
  return [
    check("emailId").exists().isEmail(),
    check("userName").exists().isAlphanumeric(),
    check("password").exists().isLength({ min: 8 }),
  ];
};

/**
 * Registers a new user with the request JSON
 * @param {request} {HTTP request object}
 * @param {response} {HTTP response object}
 */
exports.createUser = (request, response) => {
  try {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      response.status(400).json({
        message: utilConstants.CLIENT_ERR,
      });
      return;
    }
    // Validate if user already exists
    userService
      .isUserUnique(request.body)
      .then((user) => {
        if (user.length) {
          response.status(422);
          response.json({
            message: utilConstants.UNIQUE_EMAIL_USER_ERR,
          });
        } else {
          // after validating
          const newUser = Object.assign({}, request.body);
          const resolve = () => {
            response.status(201).json();
          };
          userService
            .createUser(newUser)
            .then(resolve)
            .catch(renderErrorResponse(response));
        }
      })
      .catch(renderErrorResponse(response));
  } catch (err) {
    renderErrorResponse(err);
  }
};

const generateLoginToken = (user) => {
  return jwt.sign(
    {
      userName: user.userName,
      userId: user._id,
    },
    utilConstants.JWT_KEY,
    {
      expiresIn: "2h",
    }
  );
};

/**
 * Logs in a registered User
 * @param {request} {HTTP request object}
 * @param {response} {HTTP response object}
 */
exports.loginUser = (request, response) => {
  try {
    const resolve = (user) => {
      if (!user) {
        return response.status(401).json({
          message: "Login Failed",
        });
      }
      if (!request.body.socialAuth) {
        bcrypt.compare(request.body.password, user.password, (err, result) => {
          if (err) {
            return response.status(401).json({
              message: "Login Failed",
            });
          }
          if (result) {
            const jwtToken = generateLoginToken(user);
            return response.status(200).json({
              _id: user._id,
              userName: user.userName,
              emailId: user.emailId,
              image: user.image,
              token: jwtToken,
            });
          }
          return response.status(401).json({
            message: "Login Failed",
          });
        });
      } else {
        const jwtToken = generateLoginToken(user);
        return response.status(200).json({
          _id: user._id,
          userName: user.userName,
          emailId: user.emailId,
          image: user.image,
          token: jwtToken,
        });
      }
    };
    userService
      .loginUser(request.body)
      .then(resolve)
      .catch(renderErrorResponse(response));
  } catch (err) {
    renderErrorResponse(err);
  }
};

/**
 * Returns updatedUser response.
 *
 * @param request
 * @param response
 */
exports.updateUser = (request, response) => {
  try {
    const updatedUser = Object.assign({}, request.body);
    const resolve = () => {
      response.status(200).json();
    };
    userService
      .updateUser(updatedUser, request.userData.userName)
      .then(resolve)
      .catch(renderErrorResponse(response));
  } catch (err) {
    renderErrorResponse(err);
  }
};

exports.getUsers = (_request, response) => {
  const resolve = (userNames) => {
    response.status(200);
    response.json(userNames);
  };
  userService.getUserNames().then(resolve).catch(renderErrorResponse(response));
};


const storage = multer.diskStorage({
  destination: function(req, file, callback){
      callback(null, '././profile_imgs');
  },
  filename: function(req, file, callback){
      callback(null, file.originalname);
  }
})

exports.upload = multer({storage: storage}).single('profile_img');

exports.uploadRes = function(req, res){
    res.json({});
}

exports.image = function(req, res){
  fs.readFile("././profile_imgs/"+req.params.filename, function(err, data){
      if(err) {
          res.writeHead(404);
          res.end(JSON.stringify(err));
          return;
      }

      else {
          res.writeHead(200);
          //res.setHeader('Content-Type', 'text/html');
          res.end(data);
      }
  })
}
/**
 * Throws error if error object is present.
 *
 * @param {Response} response The response object from service
 * @return {Function} The error handler function.
 */
let renderErrorResponse = (response) => {
  const errorCallback = (error) => {
    if (error && error.code === utilConstants.MONGO_CONFLICT_CODE) {
      response.status(422);
      response.json({
        message: utilConstants.UNIQUE_EMAIL_USER_ERR,
      });
    } else if (error && error.name !== utilConstants.VALIDATION_ERR) {
      response.status(500);
      logger.fatal(`Server error: ${error.message}`);
      response.json({
        message: utilConstants.SERVER_ERR,
      });
    } else if (error && error.name === utilConstants.VALIDATION_ERR) {
      response.status(400);
      logger.warn(`Client error: ${error.message}`);
      response.json({
        message: utilConstants.CLIENT_ERR,
      });
    }
  };
  return errorCallback;
};
