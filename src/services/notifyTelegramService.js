import axios from "axios";

require("dotenv").config();

const accessToken = process.env.TELEGRAM_TOKEN;
const TELEGRAM_GROUPCHAT_ID = process.env.TELEGRAM_GROUPCHAT_ID;

const notifyTelegram = async (log) => {
  // console.log("data", log);

  const text = log;

  const data = {
    chat_id: TELEGRAM_GROUPCHAT_ID,
    text: text,
  };

  let result;
  console.log("data", data);
  await axios({
    method: "POST",
    url: `https://api.telegram.org/bot${accessToken}/sendMessage`,
    data: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      result = response.data;
    })
    .catch((e) => {
      result = e.response.data;
    });

  return result;
};
module.exports = notifyTelegram;
