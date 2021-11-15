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



});


/**************  MODULE EXPORTS  **************/
module.exports = {
    userModule
}