const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
require("dotenv").config();

dotenv.config();

const app = express();

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/webhook", (req, res) => {
  if (req.query["hub.verify_token"] === process.env.VERIFY_TOKEN) {
    res.send(req.query["hub.challenge"]);
  } else {
    res.send("Error, wrong validation token");
  }
});

app.post("/webhook", (req, res) => {
  const webhook_event = req.body.entry[0];
  if (webhook_event.messaging) {
    webhook_event.messaging.forEach((event) => {
      console.log(event);
      const sender_psid = event.sender.id;
      if (event.message && !event.message.is_echo) {
        const message = {
          text: "Hello, I'm ChatGPT, how can I assist you today?",
        };
        callSendAPI(sender_psid, message);
      }
    });
  }
  res.status(200).send("EVENT_RECEIVED");
});

function callSendAPI(sender_psid, response) {
  const request_body = {
    recipient: {
      id: sender_psid,
    },
    message: response,
  };
  request(
    {
      uri: "https://graph.facebook.com/v12.0/me/message s",
      qs: { access_token: PAGE_ACCESS_TOKEN },
      method: "POST",
      json: request_body,
    },
    (err, res, body) => {
      if (!err && res.statusCode === 200) {
        console.log("message sent!");
      } else {
        console.error("Unable to send message:" + err);
      }
    }
  );
}

app.listen(process.env.PORT || 1337, () => console.log("webhook is listening"));
