/**************  IMPORTS  **************/
const { query } = require("../utils/db.js");
const bcrypt = require('bcrypt');
const userModule = require("express").Router();

/**************  FUNCTIONALITY  **************/


userModule.get("/user/test", (req, res) => {
    res.json(bcrypt.hashSync("1234", 8));
})

userModule.get("/user/:user_id", (req, res) => {

    // If we actually get a user id
    if (Number.isInteger(req.params.user_id)) {

    } else {
        res.status(400).json({
            error: 'Invalid User ID'
        });
    }

});

userModule.put("/user/register", (req, res) => {

    const { username, password } = req.body;

    if (username.match(/[a-zA-Z0-9]{1,32}/)) {

        // Since we regex-check the username, it is safe to use it in a query
        query(`SELECT * FROM nespresso_users WHERE user_name LIKE '${username}'`, (err, rows) => {
            if (!err) {
                if (rows.length <= 0) {

                    // Encrypt password
                    const encryptedPassword = bcrypt.hashSync(password, 8);

                    // Create user in database with default role of user
                    query(`INSERT INTO nespresso_users (user_name, user_role_id, user_password_hash) VALUES ('${username}', 2 /* User */, '${encryptedPassword}')`, (err) => {
                        if (!err) {
                            res.json({
                                success: true
                            });
                        } else {
                            res.json({
                                success: false,
                                error: "Unknown error. Please contact system administrator.",
                                debugMessage: err.sqlMessage
                            });
                        }
                    });

                } else {
                    // User already exists
                    res.json({
                        success: false,
                        error: "Username already exists",
                        fields: ['username']
                    });
                }
            } else {
                res.json({
                    success: false,
                    error: "Unknown Error",
                    fields: []
                });
            }
        });

    } else {
        res.json({
            success: false,
            error: "Invalid Username",
            fields: ['username']
        });
    }

});


/**************  MODULE EXPORTS  **************/
module.exports = {
    userModule
}