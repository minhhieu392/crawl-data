import _ from "lodash";
import models from "../entity/index";
import MODELS from "../models/models";
const logEvents = require("../utils/logEvents");
const notifySlack = require("./testSlack");
const sendGmail = require("./sendMailService");
const notifyZalo = require("./notifyZaloService");
const callSendAPI = require("./notifyFacebookService");
const notifyTelegram = require("./notifyTelegramService");
import moment from "moment";
const { searchTermsNotices } = models;
const sendLog = async (data, createBids) => {
  // console.log("data", data, createBids);
  const currentTime = moment().format("YYYY/MM/DD HH:mm");
  const findListAcc = await MODELS.findOne(searchTermsNotices, {
    where: { searchTermsId: data.id },
  }).catch((e) => {
    let error = new Error(e);
    console.log(error);
    logEvents(`sendLog---${idSearch}---${error.message}`);
  });
  console.log("test 01", findListAcc, data.id);
  if (findListAcc) {
    // if (findListAcc) {
    //   const log = `${currentTime} Thông báo gói thầu: Loại tìm kiếm ${data.loopType} Id: ${data.id} Điều kiện tìm kiếm: ${data.searchTitle} Kết quả tìm kiếm ${createBids.id}--${createBids.bidsName}--${data.version}`;
    //   sendGmail(log, findListAcc.email);
    //   console.log("findListAcc", findListAcc.email);
    // }
    // if (findListAcc.zaloId.length > 0) {
    //   notifyZalo(log, findListAcc.zaloId);
    // }
    // if (findListAcc.facebookId.length > 0) {
    //   callSendAPI(log, findListAcc.facebookId);
    // }
    if (findListAcc) {
      const log = `${currentTime} Mess ${data.loopType} \n ${data.id} ${data.searchTitle} \n ${createBids.id} ${createBids.bidsName} ${data.version}`;
      notifyTelegram(log);
    }
    if (findListAcc) {
      const log = `_${currentTime}_--*Mess*--*${data.loopType}* \n *${data.id}*--${data.searchTitle} \n ${createBids.id} ${createBids.bidsName} ${data.version}`;
      // console.log("findListAcc", findListAcc.email);
      notifySlack(log);
    }
  } else {
    logEvents(`sendLog---${idSearch}---${log}`);
  }
};
module.exports = sendLog;
