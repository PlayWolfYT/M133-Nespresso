/**************  IMPORTS  **************/
const { query } = require("../utils/db.js");
const bcrypt = require("bcrypt");
const authModule = require("express").Router();

const { sanitize, generateJWT } = require("../utils/functions.js");

authModule.post("/login", (req, res) => {
  // LAYOUT:
  // api/v2/auth -> username, password

  const { username, password } = req.body;

  const safe_username = sanitize(username);

  query(
    `SELECT * FROM nespresso_users LEFT JOIN nespresso_user_roles ON role_id = user_role_id WHERE user_name = '${safe_username}' LIMIT 1`,
    (err, rows) => {
      if (!err) {
        if (rows.length > 0) {
          const dbUser = rows[0];

          const db_password = dbUser.user_password_hash;

          if (bcrypt.compareSync(password.toString(), db_password)) {
            // User Login is valid

            const data = {
              id: dbUser.user_id,
              username: dbUser.user_name,
              role: dbUser.role_name,
              create_at: dbUser.user_create_date,
              modify_at: dbUser.user_modify_date,
            };

            const token = generateJWT(data);
            res.json({ token: token });
          } else {
            res.sendStatus(401);
          }
        } else {
          res.sendStatus(401);
        }
      } else {
        console.log("Fatal error on auth: ", err);
        res.sendStatus(500);
      }
    }
  );
});

/*const authenticateRequest = (req, res, next) => {
  const header = req.headers.nespresso_token;
};*/

/**************  MODULE EXPORTS  **************/
module.exports = {
  authModule,
  //authenticateRequest,
};
