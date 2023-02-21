import nodemailer from "nodemailer";
import MODELS from "../models/models";
import models from "../entity/index";
const logEvents = require("../utils/logEvents");
require("dotenv").config();
const { searchTermsNotices } = models;
const sendGmail = async (body, emailList) => {
  let finnalyResult;
  let emailArray = emailList.slice(1, -1).split(",");
  emailArray = emailArray.map((email) => email.trim());
  console.log("emailList", emailList);
  console.log("emailArray", emailArray);

  try {
    const transporter = await nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: "465",
      secure: true,
      auth: {
        user: process.env.EMAIL_APP,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });
    emailArray.forEach((emailTo) => {
      transporter.sendMail(
        {
          from: process.env.EMAIL_APP,
          to: emailTo || "email nhận",
          subject: body || "tiêu đề",
          text: body || "nội dung",
        },
        (error, info) => {
          if (error) {
            console.log("email error", error);
            finnalyResult = { success: false };
          } else {
            console.log("Message %s sent: %s", info.messageId, info.response);
            finnalyResult = { success: true };
          }
        }
      );
    });
  } catch (error) {
    console.log("error: ", error);
  }
  console.log("send email finnalyResult", finnalyResult);

  return finnalyResult;
};
module.exports = sendGmail;
