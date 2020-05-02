const utilConstants = require("./api/utils/Constants");
const express = require("express"),
  app = express(),
  port = process.env.PORT || utilConstants.PORT,
  mongoose = require("mongoose"), //created model loading here
  bodyParser = require("body-parser");

// mongoose instance connection url connection
mongoose.connect(utilConstants.MONGODB_URL, {
  useMongoClient: true,
});
mongoose.Promise = global.Promise;

//Adding body parser for handling request and response objects.
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }))

//Enabling CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

//Initialize app
let initApp = require("./api/app");
initApp(app);

app.listen(port);
console.log("QBoard RESTful API server started on: " + port);
