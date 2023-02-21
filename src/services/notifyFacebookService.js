const request = require("request");
require("dotenv").config();

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

function callSendAPI(response, sender_psid) {
  sender_psid.forEach((userId) => {
    const request_body = {
      recipient: {
        id: userId,
      },
      message: response,
    };
    request(
      {
        uri: "https://graph.facebook.com/v12.0/me/messages",
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
  });
}
module.exports = callSendAPI;
