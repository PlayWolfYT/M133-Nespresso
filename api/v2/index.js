/***********    IMPORTS / CONFIGURATIONS    ************/
const express = require("express");
const bodyParser = require('body-parser');
require("dotenv").config();

const { setupDatabase } = require("./utils/db.js");
const { tagdetected } = require("./api_modules/tagdetected.js");
const { userModule } = require("./api_modules/userModule.js");
const { authModule } = require('./api_modules/authModule.js');

/***********    DATABASE SETUP    ************/
setupDatabase().catch((err) => {
    console.log("Could not setup database. Please check configuration in '.env'! Error: ", err);
});

/***********    CONSTANTS    ************/
const APP_ROOT = process.env.APP_ROOT;
const APP_PORT = process.env.APP_PORT;
const app = express();
app.use(bodyParser.json());

const api = express.Router();



/***********    API PATHS    ************/
app.use(APP_ROOT, api);
app.use(APP_ROOT, userModule);
app.use(APP_ROOT, authModule);

api.get("/tagdetected/:tag/", (req, res) => tagdetected(req, res));

/***********    API START    ************/
app.listen(APP_PORT, () => {
    console.log(`API Listening on Port ${APP_PORT}`);
});