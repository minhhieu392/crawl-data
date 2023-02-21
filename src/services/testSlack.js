const axios = require("axios");

const notifySlack = async (log) => {
  const response = axios
    .post(
      "https://hooks.slack.com/services/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",
      {
        text: log,
      },
      {
        headers: {
          "Content-type": "application/json",
        },
      }
    )
    .then((rs) => {
      console.log("re ok");
    })
    .catch((e) => {
      console.log("e", e);
    });
};
module.exports = notifySlack;
