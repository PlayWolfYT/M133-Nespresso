/***********    IMPORTS / CONFIGURATIONS    ************/
const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const { setupDatabase } = require("./utils/db.js");
const { tagModule } = require("./api_modules/tagModule.js");
const { setupModule } = require("./api_modules/setupModule.js");
const { userModule } = require("./api_modules/userModule.js");
const { authModule } = require("./api_modules/authModule.js");
const { paypalModule } = require("./api_modules/paypalModule.js");

/***********    DATABASE SETUP    ************/
setupDatabase()
  .then(() => {
    console.log("Successfully connected and setup database");
  })
  .catch((err) => {
    console.log(
      "Could not setup database. Please check configuration in '.env'! Error: ",
      err.message
    );
  });

/***********    CONSTANTS    ************/
const APP_ROOT = process.env.APP_ROOT;
const APP_PORT = process.env.APP_PORT;
const app = express();
app.use(bodyParser.json());

/***********    API PATHS    ************/
app.use(APP_ROOT, tagModule);
app.use(APP_ROOT, setupModule);
app.use(APP_ROOT, userModule);
app.use(APP_ROOT, authModule);
app.use(APP_ROOT, paypalModule);

/***********    API START    ************/
app.listen(APP_PORT, () => {
  console.log(`API Listening on Port ${APP_PORT}`);
});
