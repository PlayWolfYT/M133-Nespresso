/**************  IMPORTS  **************/
const { query } = require("../utils/db.js");
const setupModule = require("express").Router();
const bcrypt = require("bcrypt");

async function isSetupNeeded() {
  let setupNeeded;
  await query(
    "SELECT (COUNT(*) > 0) as 'users_available' FROM nespresso_users WHERE user_id != 1",
    (err, rows) => {
      if (!err) {
        setupNeeded = !rows[0].users_available;
      } else throw err;
    }
  );
  return setupNeeded;
}
/**************  FUNCTIONALITY  **************/
setupModule.get("/setup", async (_req, res) => {
  // Check if the setup is needed.

  const setupNeeded = await isSetupNeeded();
  res.json({ setup: setupNeeded });
});

setupModule.post("/setup/createUser", async (req, res) => {
  const { username, password } = req.body;
  const setupNeeded = await isSetupNeeded();

  if (!setupNeeded) {
    res.sendStatus(403);
    return;
  }
  if (username.match(/[a-zA-Z0-9]{1,32}/)) {
    const encryptedPassword = bcrypt.hashSync(password, 8);
    query(
      `INSERT INTO nespresso_users (user_name, user_role_id, user_password_hash) VALUES ('${username}', 1 /* Administrator */, '${encryptedPassword}')`,
      (err) => {
        if (!err) {
          res.json({
            success: true,
          });
        } else {
          res.json({
            success: false,
            error: "Unknown error. Please contact system administrator.",
            debugMessage: err.sqlMessage,
          });
        }
      }
    );
  }
});

/**************  MODULE EXPORTS  **************/
module.exports = {
  setupModule,
};
