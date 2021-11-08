const express = require("express");

require("dotenv").config();

const APP_ROOT = process.env.APP_ROOT;
const APP_PORT = process.env.APP_PORT;

const app = express();


app.get(APP_ROOT + "tagdetected/:tag/", (req, res) => {
    let tag = req.params.tag;

    if (tag.match(/^[a-zA-Z0-9]{14}$/)) {
        res.json(
            {
                tag: tag,
                user: "DEMO User",
                authorized: true,
                coffeeType: 2,
                credits: 100,
                message: {
                    title: "DEMO Message Title",
                    body: "DEMO Message Body",
                    author: "DEMO Message Author"
                }
            }
        );
    } else {
        res.json(
            {
                tag: tag,
                user: "",
                authorized: false,
                coffeeType: 0,
                credits: -1,
                message: {
                    title: "INVALID TAG",
                    body: "INVALID TAG",
                    author: "INVALID TAG"
                }
            }
        );
    }
});

app.listen(APP_PORT, () => {
    console.log(`API Listening on Port ${APP_PORT}`);
});