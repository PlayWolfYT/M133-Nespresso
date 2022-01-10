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

async function validateJWT(jwt) {
  try {
    const data = JWT.verify(jwt, process.env.APP_SECRET);
    return { jwt: jwt, data: data };
  } catch (e) {
    if (e instanceof JWT.TokenExpiredError) {
      const token = await renewJWT(jwt);
      return await validateJWT(token);
    } else {
      return false;
    }
  }
}

function renewJWT(jwt) {
  const safe_username = sanitize(JWT.decode(jwt).username);
  return new Promise((resolve, reject) => {
    query(
      `SELECT * FROM nespresso_users LEFT JOIN nespresso_user_roles ON role_id = user_role_id WHERE user_name = '${safe_username}' LIMIT 1`,
      (err, rows) => {
        if (err) {
          reject(err);
        }

        const user = rows[0];

        const data = {
          id: user.user_id,
          username: user.user_name,
          role: user.role_name,
          create_at: user.user_create_date,
          modify_at: user.user_modify_date,
        };
        resolve(generateJWT(data));
      }
    );
  });
}

// async function validateJWT(jwt) {
//   try {
//     const data = JWT.verify(jwt, process.env.APP_SECRET);
//     return {
//       token: jwt,
//       data: data,
//       err: undefined,
//     };
//   } catch (e) {
//     if (e instanceof JWT.TokenExpiredError) {
//       // TODO: Fix this

//       let renewRet = await renewJWT(jwt);

//       console.log("RenewRet: ", renewRet);

//       return renewRet;
//     } else {
//       return { token: undefined, data: undefined, err: e };
//     }
//   }
// }

// async function renewJWT(jwt, callback = undefined) {
//   const safe_username = sanitize(
//     JWT.decode(jwt).username
//   ); /* We can grab the username from the jwt */
//   return query(
//     `SELECT * FROM nespresso_users LEFT JOIN nespresso_user_roles ON role_id = user_role_id WHERE user_name = '${safe_username}' LIMIT 1`,
//     (err, rows) => {
//       if (!err) {
//         const user = rows[0];

//         const data = {
//           id: user.user_id,
//           username: user.user_name,
//           role: user.role_name,
//           create_at: user.user_create_date,
//           modify_at: user.user_modify_date,
//         };

//         if (callback) return callback(undefined, generateJWT(data));

//         return generateJWT(data);
//       } else {
//         if (callback) return callback(err, undefined);
//         return err;
//       }
//     }
//   );
// }

module.exports = {
  sanitize,
  generateJWT,
  validateJWT,
  renewJWT,
};
