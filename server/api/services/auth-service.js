const jwt = require("jsonwebtoken"),
  utilConstants = require("../utils/Constants");

module.exports = (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(bearerToken, utilConstants.JWT_KEY);
    req.userData = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Login Failed"
    });
  }
};
