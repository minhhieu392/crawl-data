import nodemailer from "nodemailer";
import CONFIG from "../config";
require("dotenv").config();

export default {
  sendGmail: async ({ emailTo, body, subject }) => {
    let finnalyResult;

    try {
      const transporter = await nodemailer.createTransport({
        host: CONFIG["MAIL_HOST"] || "smtp.gmail.com",
        port: CONFIG["MAIL_PORT"] || "465",
        secure: true,
        auth: {
          user: process.env.EMAIL_APP,
          pass: process.env.EMAIL_APP_PASSWORD,
        },
      });

      await transporter.sendMail(
        {
          from: process.env.EMAIL_APP,
          to: emailTo || "email nhận",
          subject: subject || "tiêu đề",
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
    } catch (error) {
      console.log("error: ", error);
    }
    console.log("send email finnalyResult", finnalyResult);

    return finnalyResult;
  },
};
