/**************  IMPORTS  **************/
//const { query } = require("../utils/db.js");
const paypalModule = require("express").Router();
const paypal = require("paypal-rest-sdk");

paypalModule.post("/paypal", (req, res) => {
  paypal.configure({
    mode: "sandbox",
    client_id: process.env.PAYPAL_CLIENT_ID,
    client_secret: process.env.PAYPAL_CLIENT_SECRET,
  });

  paypal.notification.webhookEvent.getAndVerify(
    JSON.stringify(req.body),
    (err, paypalRes) => {
      if (err) {
        console.error(err);
      } else {
        if (paypalRes) {
          console.log("Received Confirmation from paypal");
          console.log("Response Body: ", req.body);

          // Add to database
        } else {
          res.sendStatus(400);
        }
      }
    }
  );

  /*const transmissionId = req.headers["PAYPAL-TRANSMISSION-ID"];
  const timeStamp = req.headers["PAYPAL_TRANSMISSION_TIME"];
  const webhookID = process.env.;*/
  res.sendStatus(200);
});

module.exports = {
  paypalModule,
};
