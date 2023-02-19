import _ from "lodash";
import models from "../entity/index";
import MODELS from "../models/models";
import { sequelize } from "../db/sequelize";
import moment from "moment";
require("dotenv").config();
const path = require("path");
const downloadPath = path.resolve(process.env.DOWLOADPATH_HSMT);
const logEvents = require("../utils/logEvents");
const { searchTerms, bids } = models;
//scroll paginationAndreload ==0
const downloadWithURL = async (newPage, urlDownload) => {
  await newPage.goto(urlDownload.urlPath).catch((e) => {
    let error = new Error(e);
    logEvents(`downloadWithURL---${urlDownload.urlPath}---${error.message}`);
  });
  const fileName = `${urlDownload.code_tbmt}`;

  const client = await newPage
    .target()
    .createCDPSession()
    .catch((e) => {
      let error = new Error(e);
      logEvents(`downloadWithURL---${urlDownload.urlPath}---${error.message}`);
    });
  await new Promise((resolve) => setTimeout(resolve, 3000));

  await client
    .send("Page.setDownloadBehavior", {
      behavior: "allow",
      downloadPath: process.env.DOWLOADPATH_HSMT
        ? process.env.DOWLOADPATH_HSMT.replace(/\//g, "\\") + fileName
        : undefined,
    })
    .catch((e) => {
      let error = new Error(e);
      logEvents(`downloadWithURL---${urlDownload.urlPath}---${error.message}`);
    });

  await new Promise((resolve) => setTimeout(resolve, 15000));
  await newPage
    .$eval(
      "#egp_body > ebid-viewer > div.p-3.fixed-top.bg-gray-200.ng-star-inserted > div > div.text-center.pt-3 > button",
      (form) => form.click()
    )
    .catch((e) => {
      let error = new Error(e);
      logEvents(`downloadWithURL---${urlDownload.urlPath}---${error.message}`);
    });

  const biddingDocumentFile = `${fileName}\\Hồ sơ mời thầu.pdf`;
  // console.log("biddingDocumentFile 12 3 4 4 4", biddingDocumentFile);
  await new Promise((resolve) => setTimeout(resolve, 3000));
  // console.log("1", biddingDocumentFile);
  console.log("check url download", urlDownload.code_tbmt);
  const findBids = await MODELS.findOne(bids, {
    where: { tbmtCode: urlDownload.code_tbmt },
  }).catch((e) => {
    let error = new Error(e);
    logEvents(`downloadWithURL---${urlDownload.urlPath}---${error.message}`);
  });
  if (findBids) {
    await MODELS.update(
      bids,
      {
        biddingDocumentFile: biddingDocumentFile,
      },
      { where: { id: parseInt(findBids.id) } }
    ).catch((e) => {
      let error = new Error(e);
      logEvents(`downloadWithURL---${urlDownload.urlPath}---${error.message}`);
    });
  }
  // console.log("download with url", urlDownload.urlPath);
  await newPage.close();
};
export default downloadWithURL;
