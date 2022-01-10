/***********    IMPORTS / CONFIGURATIONS    ************/
const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const { setupDatabase } = require("./utils/db.js");
const { tagdetected } = require("./api_modules/tagdetected.js");
const { setupModule } = require('./api_modules/setupModule.js');
const { userModule } = require("./api_modules/userModule.js");
const { authModule } = require("./api_modules/authModule.js");
const { paypalModule } = require("./api_modules/paypalModule.js");
const { validateJWT, renewJWT } = require("./utils/functions.js");

/***********    DATABASE SETUP    ************/
setupDatabase()
  .then(() => {
    console.log("Successfully connected and setup database");
  })
  .catch((err) => {
    console.log(
      "Could not setup database. Please check configuration in '.env'! Error: ",
      err
    );
  });

/***********    CONSTANTS    ************/
const APP_ROOT = process.env.APP_ROOT;
const APP_PORT = process.env.APP_PORT;
const app = express();
app.use(bodyParser.json());

const api = express.Router();

/***********    API PATHS    ************/
app.use(APP_ROOT, api);
app.use(APP_ROOT, setupModule);
app.use(APP_ROOT, userModule);
app.use(APP_ROOT, authModule);
app.use(APP_ROOT, paypalModule);

api.get("/tagdetected/:tag/", (req, res) => tagdetected(req, res));

api.get("/debug", async (req, res) => {
  /* let matches = [
    ...req.headers.authorization.matchAll(/Bearer\s(.+)\.(.+)\.(.+)/g),
  ][0];
  const header = matches[1];
  const data = matches[2];
  const sig = matches[3];
 */

  if (req.headers.authorization) {
    let token = req.headers.authorization;
    token = token.split(" ")[1];
    let data = undefined;
    try {
      data = validateJWT(token);
      console.log(data);
      res.send("Valid JWT");
    } catch (e) {
      switch (e.message) {
        case "invalid signature":
          res.status(403).json({ error: "Why are you modifying your jwt?" });
          break;
        case "jwt expired": {
          // Renew the jwt
          renewJWT(token, (err, new_jwt) => {
            if (new_jwt) {
              res.json({ token: new_jwt });
            } else {
              res.status(403).json({
                error: "Token could not get renewed. " + err.sqlMessage,
              });
            }
          });

          break;
        }
        default:
          console.log("Unknown: " + e.message);
          break;
      }
    }
  } else {
    res.send();
  }

  //res.send();
});

/***********    API START    ************/
app.listen(APP_PORT, () => {
  console.log(`API Listening on Port ${APP_PORT}`);
});
