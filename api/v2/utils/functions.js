const { query } = require("../utils/db.js");
const JWT = require("jsonwebtoken");

function sanitize(str = "") {
  // eslint-disable-next-line no-control-regex
  return str.replace(/[\0\x08\x09\x1a\n\r"'\\%]/g, function (char) {
    switch (char) {
      case "\0":
        return "\\0";
      case "\x08":
        return "\\b";
      case "\x09":
        return "\\t";
      case "\x1a":
        return "\\z";
      case "\n":
        return "\\n";
      case "\r":
        return "\\r";
      case '"':
      case "'":
      case "\\":
      case "%":
        return "\\" + char; // prepends a backslash to backslash, percent,
      // and double/single quotes
      default:
        return char;
    }
  });
}

function generateJWT(data) {
  const exp =
    "1m"; /* Valid for one minute, so people cant do much if admin gets revoked */
  return JWT.sign(data, process.env.APP_SECRET, { expiresIn: exp });
}

function validateJWT(jwt) {
  return JWT.verify(jwt, process.env.APP_SECRET);
}

async function renewJWT(jwt, callback) {
  const safe_username = sanitize(
    JWT.decode(jwt).username
  ); /* We can grab the username from the jwt */
  query(
    `SELECT * FROM nespresso_users LEFT JOIN nespresso_user_roles ON role_id = user_role_id WHERE user_name = '${safe_username}' LIMIT 1`,
    (err, rows) => {
      if (!err) {
        const user = rows[0];

        const data = {
          id: user.user_id,
          username: user.user_name,
          role: user.role_name,
          create_at: user.user_create_date,
          modify_at: user.user_modify_date,
        };

        callback(undefined, generateJWT(data));
      } else {
        callback(err, undefined);
      }
    }
  );
}

module.exports = {
  sanitize,
  generateJWT,
  validateJWT,
  renewJWT,
};
