const axios = require("axios");

const notifyZalo = async (log) => {
  axios
    .post(
      "https://openapi.zalo.me/v2.0/oa/message",
      {
        recipient: {
          oid: "0379663319",
        },
        message: {
          text: "Hello World",
        },
      },
      {
        headers: {
          Authorization: "Bearer {access_token}",
          "Content-Type": "application/json",
        },
      }
    )
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
};
module.exports = notifyZalo;
