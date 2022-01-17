const { sanitize } = require("../utils/functions.js");
const { query } = require("../utils/db.js");
const { authenticateRequest } = require("./authModule.js");
const tagModule = require("express").Router();

// AUTOMATIC API CALL FROM MACHINE WHEN TAG IS DETECTED
tagModule.get("/tagdetected/:tag/", (req, res) => {
  let responded = false;
  let tag = sanitize(req.params.tag);
  let resData = {
    tag: tag,
    user: "UNKNOWN",
    authorized: false,
    coffeeType: 0,
    credits: -1,
    message: {
      title: "FATAL ERROR",
      body: "A fatal error occured, please contact the system administrators!",
      author: "SYSTEM",
    },
  };

  function respond() {
    if (!responded) {
      res.json(resData);
      responded = true;
    }
  }

  // TODO: Add statistics
  if (tag.match(/^[a-zA-Z0-9]{14}$/)) {
    // We have a valid tag

    query(
      `SELECT * FROM nespresso_cups INNER JOIN nespresso_cup_sizes ON cup_cup_size_id = cup_size_id WHERE cup_id = '${tag}'`,
      (err, rows) => {
        if (!err) {
          if (rows.length > 0) {
            // Tag was found in database
            let cup = rows[0];

            // If cup size is UNKNOWN
            if (cup.cup_cup_size_id === 1) {
              resData.message.title = "Tasse nicht eingerichtet";
              resData.message.body =
                "Ihre Tasse ist noch nicht eingerichtet. \nBitte gehen Sie auf die Webseite um die Tasse zu konfigurieren.";
              respond();
            } else {
              resData.coffeeType = cup.cup_size_value;

              query(
                `SELECT * FROM nespresso_users LEFT JOIN nespresso_user_roles ON nespresso_users.user_role_id = nespresso_user_roles.role_id WHERE user_id = ${cup.cup_user_id}`,
                (err, rows) => {
                  if (!err) {
                    let user = rows[0];

                    // Edge case! If the user got deleted, yet the cup is still available.
                    // This is only implemented so the app does not crash even when used improperly.
                    if (!user) {
                      resData.message.title = "Kritischer Fehler";
                      resData.message.body =
                        "Bitte melden Sie einem Administrator, dass der Benutzer zu dieser Tasse nicht mehr existiert.";
                    }

                    if (user.user_id === 1) {
                      resData.message.title = "Tasse gehört noch keiner Person";
                      resData.message.body =
                        "Ihre Tasse ist noch keiner Person zugewiesen. \nBitte gehen Sie auf die Webseite um die Tasse zu konfigurieren.";
                      respond();
                    } else {
                      // Set user to request
                      resData.user = user.user_name;

                      query(
                        `SELECT d.donation_id, d.donation_message, d.donation_create_date, f.user_name as 'donation_from_user' FROM nespresso_donations d LEFT JOIN nespresso_users f ON d.donation_from_user_id = f.user_id WHERE d.donation_to_user_id = ${user.user_id} AND d.donation_used = false AND d.donation_valid_date <= CURRENT_TIMESTAMP ORDER BY d.donation_create_date`,
                        (err, rows) => {
                          if (!err) {
                            if (rows.length > 0) {
                              // We have a donation
                              let donation = rows[0];

                              // Mark donation as used
                              query(
                                `UPDATE nespresso_donations SET donation_used = true WHERE donation_id = ${donation.donation_id}`
                              );

                              // Read credits
                              query(
                                `SELECT SUM(transaction_amount) as 'credits' FROM nespresso_transactions WHERE transaction_user_id = ${user.user_id} GROUP BY transaction_user_id`,
                                (err, rows) => {
                                  if (!err) {
                                    resData.credits = rows[0]?.credits ?? 0;

                                    // TODO: Add a statistic

                                    resData.authorized = true;
                                    resData.message.title = `SPENDE vom ${donation.donation_create_date.toLocaleDateString(
                                      "de-DE"
                                    )} um ${donation.donation_create_date.toLocaleTimeString(
                                      "de-DE"
                                    )} von ${
                                      donation.donation_from_user
                                    } erhalten.`;
                                    resData.message.body =
                                      donation.donation_message;
                                    resData.message.author =
                                      donation.donation_from_user;
                                    respond();
                                  }
                                }
                              );
                            } else {
                              // We dont have a donation, check for transactions / credit count

                              query(
                                `SELECT SUM(transaction_amount) as 'credits' FROM nespresso_transactions WHERE transaction_user_id = ${user.user_id} GROUP BY transaction_user_id`,
                                (err, rows) => {
                                  if (!err) {
                                    let credits = rows[0]?.credits ?? 0;

                                    if (credits > 0) {
                                      // User still has credits

                                      // TODO: Add a statistic

                                      query(
                                        `INSERT INTO nespresso_transactions (transaction_user_id, transaction_amount) VALUES (${user.user_id}, -1)`
                                      );
                                      credits--;

                                      resData.credits = credits;
                                      resData.authorized = true;
                                      resData.message.title =
                                        "Ihr Kaffe wird vorbereitet...";
                                      resData.message.body = `Ihr Kaffee sollte in kürze bereit stehen. Bitte warten Sie einen Moment. \nVerbleibende Credits: ${credits}`;
                                    } else {
                                      // User does not have enough credits to buy coffee
                                      resData.credits = credits;
                                      resData.message.title = "Keine Credits";
                                      resData.message.body =
                                        "Sie haben leider nicht genügend Credits um einen Kaffee zu kaufen.";
                                    }
                                    respond();
                                  }
                                }
                              );
                            }
                          }
                        }
                      );
                    }
                  }
                }
              );
            }
          } else {
            // Tag was not found
            // Register Tag
            query(
              `INSERT INTO nespresso_cups (cup_id, cup_cup_size_id, cup_user_id) VALUES ('${tag}', 1, 1)`,
              (err) => {
                if (!err) {
                  // We don't have an error, so tell the user that the cup was registered.
                  resData.message.title = "Tasse registriert";
                  resData.message.body =
                    "Ihre Kaffee-Tasse wurde registriert.\nBitte gehen Sie auf die Webseite um die Tasse zu konfigurieren.";
                }

                respond();
              }
            );
          }
        } else {
          console.log(err);
          respond();
        }
      }
    );
  } else {
    resData.message.title = "INVALID TAG";
    resData.message.body = "INVALID TAG";
    respond();
  }
});

tagModule.get("/tag/get", authenticateRequest, (req, res) => {
  // Only authenticated users can do stuff with tags

  // Check if we are admin or not
  if (res.locals.user.role === 1) {
    // Check if we supplied a userid
    if (req.body.userid) {
      // Respond with all tags from that user
      query(
        `
          SELECT 
            c.cup_id, 
            UNIX_TIMESTAMP(c.cup_create_date) as 'cup_create_date', 
            UNIX_TIMESTAMP(c.cup_modify_date) as 'cup_modify_date', 
            cs.cup_size_name, 
            cs.cup_size_value, 
            UNIX_TIMESTAMP(cs.cup_size_create_date) as 'cup_size_create_date', 
            UNIX_TIMESTAMP(cs.cup_size_modify_date) as 'cup_size_modify_date', 
            u.user_id, 
            u.user_name, 
            u.user_public_profile, 
            UNIX_TIMESTAMP(u.user_create_date) as 'user_create_date', 
            UNIX_TIMESTAMP(u.user_modify_date) as 'user_modify_date', 
            r.role_id, 
            r.role_name, 
            UNIX_TIMESTAMP(r.role_create_date) as 'role_create_date'
          FROM 
            nespresso_cups c 
          LEFT JOIN 
            nespresso_cup_sizes cs 
          ON 
            c.cup_cup_size_id = cs.cup_size_id 
          LEFT JOIN 
            nespresso_users u 
          ON 
            c.cup_user_id = u.user_id 
          LEFT JOIN 
            nespresso_user_roles r 
          ON 
            u.user_role_id = r.role_id
          WHERE u.user_id != 
          ` + (parseInt(req.body.userid) ? parseInt(req.body.userid) : -1),
        (err, rows) => {
          if (err) {
            res.status(500).json({ error: err.sqlMessage });
            return;
          }
          res.json(rows);
        }
      );
    } else {
      // Respond with all tags
      query(
        `
          SELECT 
            c.cup_id, 
            UNIX_TIMESTAMP(c.cup_create_date) as 'cup_create_date', 
            UNIX_TIMESTAMP(c.cup_modify_date) as 'cup_modify_date', 
            cs.cup_size_name, 
            cs.cup_size_value, 
            UNIX_TIMESTAMP(cs.cup_size_create_date) as 'cup_size_create_date', 
            UNIX_TIMESTAMP(cs.cup_size_modify_date) as 'cup_size_modify_date', 
            u.user_id, 
            u.user_name, 
            u.user_public_profile, 
            UNIX_TIMESTAMP(u.user_create_date) as 'user_create_date', 
            UNIX_TIMESTAMP(u.user_modify_date) as 'user_modify_date', 
            r.role_id, 
            r.role_name, 
            UNIX_TIMESTAMP(r.role_create_date) as 'role_create_date'
          FROM 
            nespresso_cups c 
          LEFT JOIN 
            nespresso_cup_sizes cs 
          ON 
            c.cup_cup_size_id = cs.cup_size_id 
          LEFT JOIN 
            nespresso_users u 
          ON 
            c.cup_user_id = u.user_id 
          LEFT JOIN 
            nespresso_user_roles r 
          ON 
            u.user_role_id = r.role_id
          WHERE u.user_id != 1
          `,
        (err, rows) => {
          if (err) {
            res.status(500).json({ error: err.sqlMessage });
            return;
          }
          res.json(rows);
        }
      );
    }
  } else {
    // Respond with own tags
    query(
      `
        SELECT 
          c.cup_id, 
          UNIX_TIMESTAMP(c.cup_create_date) as 'cup_create_date', 
          UNIX_TIMESTAMP(c.cup_modify_date) as 'cup_modify_date', 
          cs.cup_size_name, 
          cs.cup_size_value, 
          UNIX_TIMESTAMP(cs.cup_size_create_date) as 'cup_size_create_date', 
          UNIX_TIMESTAMP(cs.cup_size_modify_date) as 'cup_size_modify_date', 
          u.user_id, 
          u.user_name, 
          u.user_public_profile, 
          UNIX_TIMESTAMP(u.user_create_date) as 'user_create_date', 
          UNIX_TIMESTAMP(u.user_modify_date) as 'user_modify_date', 
          r.role_id, 
          r.role_name, 
          UNIX_TIMESTAMP(r.role_create_date) as 'role_create_date'
        FROM 
          nespresso_cups c 
        LEFT JOIN 
          nespresso_cup_sizes cs 
        ON 
          c.cup_cup_size_id = cs.cup_size_id 
        LEFT JOIN 
          nespresso_users u 
        ON 
          c.cup_user_id = u.user_id 
        LEFT JOIN 
          nespresso_user_roles r 
        ON 
          u.user_role_id = r.role_id
        WHERE u.user_id != 
        ` + res.locals.user.user_id,
      (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.sqlMessage });
          return;
        }
        res.json(rows);
      }
    );
  }

  //}
});

tagModule.get("/tag/get/unowned", authenticateRequest, (_req, res) => {
  query(
    `
    SELECT 
      c.cup_id, 
      UNIX_TIMESTAMP(c.cup_modify_date) as 'cup_modify_date'
    FROM
      nespresso_cups c
    WHERE c.cup_user_id = 1 /* Owned by System */
  `,
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.sqlMessage });
        return;
      }

      res.json(rows);
    }
  );
});

tagModule.post("/tag/claim/:tag", authenticateRequest, (req, res) => {
  let tag = sanitize(req.params.tag);

  // Validate if we have a valid tag
  if (tag.match(/^[a-zA-Z0-9]{14}$/)) {
    // Check if the tag is really exists and is unclaimed
    // (Using ${tag} is safe here, since we checked it with a regex)
    query(
      `
      SELECT 
        * 
      FROM
        nespresso_cups c
      WHERE
        c.cup_id = '${tag}'
    `,
      async (err, rows) => {
        if (err) {
          res.status(500).json({
            error: err.sqlMessage,
          });
          return;
        }

        if (rows.length > 0) {
          const tag = rows[0];

          // Check if cup is owned by SYSTEM (unowned cup)
          if (tag.cup_user_id === 1) {
            // If the user supplied a user-id, check if the user is admin
            // Otherwise, use own id
            // Since we are logged in we can just get the user id from the token

            let userID;
            if (req.body.user_id) {
              // If user is admin, allow it
              if (res.locals.user.role_id === 1) {
                if (!Number.isInteger(req.body.user_id)) {
                  res.status(400).json({
                    error: "invalid_user",
                    note: "What are you doing? Stop that. You will not bypass this system!",
                  });
                  return;
                }
                userID = req.body.user_id;

                // Check if the user actually exists
                // It is safe to use ${userID} here because we check above if it is a integer
                await query(
                  `
                    SELECT 
                      * 
                    FROM 
                      nespresso_users u
                    WHERE
                      u.user_id = ${userID}
                  `,
                  (err, rows) => {
                    if (err) {
                      res.status(500).json({
                        error: err.sqlMessage,
                      });
                      userID = undefined;
                      return;
                    }

                    // Check if we found a user or not
                    // If we have, the id is already set, so we don't need to change it
                    if (rows.length <= 0) {
                      res.status(400).json({
                        error: "user_not_found",
                      });
                      userID = undefined;
                      return;
                    }
                  }
                );
              } else {
                // User did supply a user id, yet he is not admin. We use his own
                userID = res.locals.user.id;
              }
            } else {
              userID = res.locals.user.id;
            }

            // We now have the user id, claim the tag to that id
            query(
              `
              UPDATE
                nespresso_cups c
              SET
                c.cup_user_id = ${userID}
              WHERE
                c.cup_id = '${tag.cup_id}'
            `,
              (err) => {
                if (err) {
                  res.status(500).json({
                    error: err.sqlMessage,
                  });
                  return;
                }

                res.sendStatus(200);
              }
            );
          } else {
            res.status(400).json({
              error: "tag_already_claimed",
            });
          }
        } else {
          res.status(400).json({
            error: "tag_not_found",
          });
        }
      }
    );
  } else {
    res.status(400).json({
      error: "INVALID TAG",
    });
  }
});

module.exports = {
  tagModule,
};
