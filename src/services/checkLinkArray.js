import _ from "lodash";
import moment from "moment";
import models from "../entity/index";
import MODELS from "../models/models";
const logEvents = require("../utils/logEvents");
const { bids, bidsSearchTerms } = models;

const checkLinkArray = async (link) => {
  let str = link.code;
  let result = str.slice(9, -3);
  const checkBids = await MODELS.findOne(bids, {
    where: { tbmtCode: result, version: link.version },
  }).catch((e) => {
    let error = new Error(e);
    logEvents(`checkLinkArray---${link}---${error.message}`);
  });
  if (checkBids) {
    await MODELS.createOrUpdate(
      bidsSearchTerms,
      {
        bidsId: Number(checkBids.id),
        searchTermsId: link.id,
      },
      { where: { bidsId: Number(checkBids.id), searchTermsId: link.id } }
    ).catch((e) => {
      let error = new Error(e);
      logEvents(`checkLinkArray---${link}---${error.message}`);
    });
    return null;
  } else {
    return link;
    // console.log('link', links)
  }
};

export default checkLinkArray;
