const { sanitize } = require("../utils/functions.js");
const { query } = require("../utils/db.js");

module.exports = {
    tagdetected(req, res) {
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
                author: "SYSTEM"
            }
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
                                resData.message.body = "Ihre Tasse ist noch nicht eingerichtet. \nBitte gehen Sie auf die Webseite um die Tasse zu konfigurieren.";
                                respond();
                            } else {
                                query(`SELECT * FROM nespresso_users LEFT JOIN nespresso_user_roles ON nespresso_users.user_role_id = nespresso_user_roles.role_id WHERE user_id = ${cup.cup_user_id}`,
                                    (err, rows) => {
                                        if (!err) {
                                            let user = rows[0];

                                            if (user.user_id === 1) {
                                                resData.message.title = "Tasse gehört noch keiner Person";
                                                resData.message.body = "Ihre Tasse ist noch keiner Person zugewiesen. \nBitte gehen Sie auf die Webseite um die Tasse zu konfigurieren.";
                                                respond();
                                            } else {

                                                // Set user to request
                                                resData.user = user.user_name;

                                                query(`SELECT d.donation_id, d.donation_message, d.donation_create_date, f.user_name as 'donation_from_user' FROM nespresso_donations d LEFT JOIN nespresso_users f ON d.donation_from_user_id = f.user_id WHERE d.donation_to_user_id = ${user.user_id} AND d.donation_used = false AND d.donation_valid_date <= CURRENT_TIMESTAMP ORDER BY d.donation_create_date`,
                                                    (err, rows) => {
                                                        if (!err) {
                                                            if (rows.length > 0) {
                                                                // We have a donation
                                                                let donation = rows[0];

                                                                // Mark donation as used
                                                                query(`UPDATE nespresso_donations SET donation_used = true WHERE donation_id = ${donation.donation_id}`);

                                                                resData.authorized = true;
                                                                resData.message.title = `SPENDE vom ${donation.donation_create_date.toLocaleDateString("de-DE")} um ${donation.donation_create_date.toLocaleTimeString("de-DE")} von ${donation.donation_from_user} erhalten.`;
                                                                resData.message.body = donation.donation_message;
                                                                resData.message.author = donation.donation_from_user;
                                                                respond();

                                                            } else {
                                                                // We dont have a donation, check for transactions / credit count

                                                                query(`SELECT SUM(transaction_amount) as 'credits' FROM nespresso_transactions WHERE transaction_user_id = ${user.user_id} GROUP BY transaction_user_id`,
                                                                    (err, rows) => {
                                                                        if (!err) {

                                                                            let credits = rows[0]?.credits ?? 0;


                                                                            if (credits > 0) {
                                                                                // User still has credits

                                                                                // Add a statistic



                                                                                query(`INSERT INTO nespresso_transactions (transaction_user_id, transaction_amount) VALUES (${user.user_id}, -1)`);
                                                                                credits--;

                                                                                resData.credits = credits;
                                                                                resData.authorized = true;
                                                                                resData.message.title = "Ihr Kaffe wird vorbereitet...";
                                                                                resData.message.body = `Ihr Kaffee sollte in kürze bereit stehen. Bitte warten Sie einen Moment. \nVerbleibende Credits: ${credits}`;


                                                                            } else {
                                                                                // User does not have enough credits to buy coffee
                                                                                resData.credits = credits;
                                                                                resData.message.title = "Keine Credits";
                                                                                resData.message.body = "Sie haben leider nicht genügend Credits um einen Kaffee zu kaufen.";
                                                                            }
                                                                            respond();
                                                                        }
                                                                    });

                                                            }
                                                        }
                                                    });

                                            }
                                        }

                                    });
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
                                        resData.message.body = "Ihre Kaffee-Tasse wurde registriert.\nBitte gehen Sie auf die Webseite um die Tasse zu konfigurieren.";
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
    }
};