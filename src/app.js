import "./env";
// import "./db";
import puppeteer from "puppeteer";
import searchAndGetLink from "./services/searchAndGetLink";
import getDetails from "./services/getDetails";
import checkSearch from "./services/checkSearch";
import checkLinkArray from "./services/checkLinkArray";
// import { muasam } from "./services/muasam";
import moment from "moment";
const express = require("express");
import path from "path";
import configs from "./configs";
import _ from "lodash";
import fs from "fs";
import pushData from "./services/pushData";
import downloadWithURL from "./services/downloadWithURL";
import getDetailSpecial from "./services/getDetailSpecial";
const http = require("http");
const bodyParser = require("body-parser");
const logEvents = require("./utils/logEvents");
const notifySlack = require("./services/testSlack");
// const sendLog = require("./services/sendLogService");
const callSendAPI = require("./services/notifyFacebookService");

const numberOfGetInfoWokers = Number(configs["NUMBER_OF_GET_INFO_WORKERS"]);
if (!fs.existsSync(path.resolve(process.cwd(), configs["STORAGE_FOLDER"]))) {
  fs.mkdirSync(path.resolve(process.cwd(), configs["STORAGE_FOLDER"]));
}
if (!fs.existsSync(path.resolve(process.cwd(), configs["PROFILES_FOLDER"]))) {
  fs.mkdirSync(path.resolve(process.cwd(), configs["PROFILES_FOLDER"]));
}
let keywords = [];
if (configs["KEY_WORDS"] && configs["KEY_WORDS"].split(",")) {
  keywords = configs["KEY_WORDS"].split(",").map((el) => {
    return el.trim();
  });
}

const app = express();

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
          text: "Hello, test 1234",
        };
        callSendAPI(sender_psid, message);
      }
    });
  }
  res.status(200).send("EVENT_RECEIVED");
});
app.listen(process.env.PORT || 1337, () => console.log("webhook is listening"));

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const waitTotimeStart = async (timeStart, { loopType, repetitionHours }) => {
  let waitTime = 0;
  if (timeStart) {
    if (Number(loopType) === 1) {
      const currentTime = moment().format("HH:mm");
      console.log(
        "checl 01",
        loopType,
        timeStart,
        currentTime,
        repetitionHours
      );

      if (timeStart < currentTime) {
        for (let i = 1; i <= 24; i++) {
          console.log(
            "check",
            timeStart.split(":")[0] * 1 + repetitionHours * i,
            currentTime.split(":")[0] * 1
          );
          if (
            timeStart.split(":")[0] * 1 + repetitionHours * i >=
            currentTime.split(":")[0] * 1
          ) {
            waitTime =
              timeStart.split(":")[0] * 60 +
              timeStart.split(":")[1] * 1 +
              repetitionHours * i * 60 -
              currentTime.split(":")[0] * 60 -
              currentTime.split(":")[1] * 1;
            break;
          }
        }
      } else {
        // ch??a ?????n tgian b???t ?????u
        waitTime =
          timeStart.split(":")[0] * 60 +
          timeStart.split(":")[1] * 1 -
          (currentTime.split(":")[0] * 60 + currentTime.split(":")[1] * 1); //tgian ch??? t??nh theo ph??t
      }
    } else {
      // loopType =2
      const currentTime = moment().format("HH:mm");
      console.log(
        "checl 01",
        loopType,
        timeStart,
        currentTime,
        repetitionHours
      );

      if (timeStart < currentTime) {
        waitTime = timeStart.split(":")[0] * 60 + 24 * 60;
        timeStart.split(":")[1] * 1 -
          (currentTime.split(":")[0] * 60 + currentTime.split(":")[1] * 1); //tgian ch??? t??nh theo ph??t
      } else {
        // ch??a ?????n tgian b???t ?????u
        waitTime =
          timeStart.split(":")[0] * 60 +
          timeStart.split(":")[1] * 1 -
          (currentTime.split(":")[0] * 60 + currentTime.split(":")[1] * 1); //tgian ch??? t??nh theo ph??t
      }
    }
  } else {
    waitTime = 0;
  }
  console.log("so phut", waitTime);
  await timeout(waitTime * 60 * 1000);
  return;
};

const main = () => {
  return new Promise(async (resolve, reject) => {
    const args = [
      "--incognito",
      "--window-position=0,0",
      "--ignore-certifcate-errors",
      "--ignore-certifcate-errors-spki-list",
      "--remote-debugging-port=9222",
      "--no-sandbox",
      // "--disable-gpu",
      "--disable-accelerated-2d-canvas",
      "--disable-setuid-sandbox",
      "--ignore-certificate-errors",
      // "--allow-no-sandbox-job",
      "--headless",
    ];

    let launchOption = {
      headless: false,
      ignoreHTTPSErrors: true,
      args: args,
      // executablePath: configs.CHROME_PATH,
    };
    const browser = await puppeteer.launch(launchOption);

    let context = await browser.createIncognitoBrowserContext().catch((e) => {
      let error = new Error(e);
      logEvents(`app---${error.message}`);
    });
    await context.newPage();
    const arrSpecial = [];
    const linkArray = [];
    const dataArray = [];

    const tabMaxConfig = configs["TABMAX"];

    const optionSearchSchedule = [];
    const optionSearchList = []; // ch???a c??c ??i???u ki???n t??m ki??mr ( t???c th???i ??c l??n trc, v??ng l???p cho ph??a sau)
    const searchTermsRS = []; // ch???a c??c ??i???u ki???n t??m ki???m t???c th???i
    const searchLoop = []; // ch???a c??c ??i???u ki???n t??m ki???m l???p
    const optionSearchLoop = [];

    // g???i h??m l???y searchTerms status = 1 v?? checkStatus  =0
    await checkSearch(searchTermsRS, searchLoop);
    // l???y xong => c???pnh???t checkStatus = 1
    optionSearchList.unshift(...searchTermsRS); // ??i???u ki???n t???c th???i dc ????a l??n ?????u
    optionSearchSchedule.push(...searchLoop); // ??i???u ki???n l???p ??c cho xu???ng cu???i

    // l???y ??i???u ki???n t??m ki???m t??? db
    // c??? m???t kho???ng th???i gian l???i qu??t, xem c?? ??i???u ki???n t??m ki???m m???i ???????c kh???i t???o kh??ng
    setInterval(async () => {
      const newSearchTermsRS = [];
      const newSearchLoop = [];
      await checkSearch(newSearchTermsRS, newSearchLoop);
      // console.log(newSearchTermsRS);
      optionSearchList.unshift(...newSearchTermsRS);
      optionSearchSchedule.push(...newSearchLoop);
      optionSearchList.push(...newSearchTermsRS);
    }, 1 * 1000 * 30);

    const searchTeamInterval = {};
    const searchTeamLoopString = {};

    // v??ng l???p t???o l???ch cho ??i???u ki???n t??m ki???m
    setInterval(async () => {
      // console.log("optionSearchSchedule", optionSearchSchedule);

      if (optionSearchSchedule.length > 0) {
        console.log("optionSearchSchedule.length", optionSearchSchedule.length);
        // const page = await context.newPage();
        const optionSearch = optionSearchSchedule.shift();

        const timeStart = new Date(optionSearch.loopStartTime);
        const endTime = new Date(optionSearch.loopStartEnd);

        if (Number(optionSearch.loopType) === 2) {
          // l???p c??c ng??y trong tu???n
          // n???u ch??a c?? v??ng l???p trong searchTeamInterval ho???c c?? r???i m?? c?? thay ?????i ??i???u ki???n t??m (checkStatus=0)
          // => x??a c?? v?? t???o v??ng l???p m???i
          if (
            !searchTeamInterval[optionSearch.id] ||
            Number(optionSearch.checkStatus === 0)
          ) {
            searchTeamLoopString[optionSearch.id] =
              JSON.stringify(optionSearch);
            // push ??i???u ki???n t??m v??o optionSearchList n???u ng??y h??m nay th???a m??n
            await waitTotimeStart(optionSearch.timeStart, {
              loopType: optionSearch.loopType,
            });
            const now = new Date();
            let today = new Date().getDay();
            const days = optionSearch.weekdays;
            if (days.includes(today) && now >= timeStart && now <= endTime) {
              optionSearchLoop.push(optionSearch);
            }

            if (searchTeamInterval[optionSearch.id]) {
              searchTeamInterval[optionSearch.id].map((e) => {
                console.log("x??a e");
                clearInterval(e);
              });
              searchTeamInterval[optionSearch.id] = [];
            }
            const loop = setInterval(async () => {
              const days = optionSearch.weekdays;
              let today = new Date().getDay();
              console.log("3", days);
              const now = new Date();

              if (days.includes(today) && now >= timeStart && now <= endTime) {
                optionSearchLoop.push(optionSearch);
                console.log("optionSearchList 2", optionSearchLoop);
              } else if (now > endTime) {
                clearInterval(searchTeamInterval[optionSearch.id]);
                const loopMap = {
                  0: "T???c th???i",
                  1: "Theo gi???",
                  2: "Theo ng??y",
                };
                let type_of_loop;

                if (
                  optionSearch.loopType !== null &&
                  loopMap[optionSearch.loopType] !== undefined
                ) {
                  type_of_loop = loopMap[optionSearch.loopType];
                }
                const log = `_${now}_--*End Loop*--*${type_of_loop}*--*${optionSearch.id}*--${optionSearch.title}`;
                notifySlack(log);
                // sendLog(optionSearch.id, log);
              }
            }, 1 * 24 * 60 * 60 * 1000);

            if (searchTeamInterval[optionSearch.id]) {
              searchTeamInterval[optionSearch.id].push(loop);
            } else {
              searchTeamInterval[optionSearch.id] = [loop];
            }

            // t???o v??ng l???p ????? push ??i???u ki???n t??m ki???m v??o optionSearchList, b???t ?????u t??? ng??y mai
          }
        } else if (Number(optionSearch.loopType) === 1) {
          // => x??a c?? v?? t???o v??ng l???p m???i
          const repetitionHours = optionSearchSchedule.repetitionHours || 24;
          const interval = repetitionHours * 60 * 60 * 1000;

          if (
            !searchTeamInterval[optionSearch.id] ||
            Number(optionSearch.checkStatus === 0)
          ) {
            await waitTotimeStart(optionSearch.timeStart, {
              loopType: optionSearch.loopType,
              repetitionHours: repetitionHours,
            });

            searchTeamLoopString[optionSearch.id] =
              JSON.stringify(optionSearch);
            const now = new Date();
            if (now >= timeStart && now <= endTime) {
              optionSearchLoop.push(optionSearch);
            }

            if (searchTeamInterval[optionSearch.id]) {
              searchTeamInterval[optionSearch.id].map((e) => {
                console.log("x??a e");
                clearInterval(e);
              });
              searchTeamInterval[optionSearch.id] = [];
            }
            const loop = setInterval(async () => {
              const now = new Date();

              if (now >= timeStart && now <= endTime) {
                optionSearchLoop.push(optionSearch);
              } else if (now > endTime) {
                clearInterval(searchTeamInterval[optionSearch.id]);
                const loopMap = {
                  0: "T???c th???i",
                  1: "Theo gi???",
                  2: "Theo ng??y",
                };
                let type_of_loop;
                // console.log("type_of_loop", loopType, loopMap[loopType]);

                if (
                  optionSearch.loopType !== null &&
                  loopMap[optionSearch.loopType] !== undefined
                ) {
                  type_of_loop = loopMap[optionSearch.loopType];
                }
                const log = `${now}--End Loop--${type_of_loop}--${optionSearch.id}--${optionSearch.title}`;
                notifySlack(log);
                // sendLog(optionSearch.id, log);
              }
            }, interval);

            if (searchTeamInterval[optionSearch.id]) {
              searchTeamInterval[optionSearch.id].push(loop);
            } else {
              searchTeamInterval[optionSearch.id] = [loop];
            }

            // t???o v??ng l???p ????? push ??i???u ki???n t??m ki???m v??o optionSearchList,b???t ?????u  interval gi??y sau
          }
        }
      }
    }, 1 * 10 * 1000);

    // c?? ??i???u ki???n t??m ki???m
    // => get listLink  =>linkArray
    const linkArrayAfterCheck = [];

    setInterval(async () => {
      let pageLength = (await context.pages()).length;
      console.log("optionSearchList", optionSearchList);
      console.log("optionSearchLoop", optionSearchLoop);
      if (pageLength < tabMaxConfig) {
        if (optionSearchList.length > 0) {
          // console.log("dataLink", dataLink.links);
          const page = await context.newPage();

          // l???y ph???n t??? ?????u ti??n trong m???ng
          const optionSearch = optionSearchList.shift();

          searchAndGetLink(page, optionSearch, linkArray, arrSpecial);
        } else if (optionSearchLoop.length > 0) {
          const page = await context.newPage();

          // l???y ph???n t??? ?????u ti??n trong m???ng
          const optionSearch = optionSearchLoop.shift();

          searchAndGetLink(page, optionSearch, linkArray, arrSpecial);
        }
      }
    }, 1 * 1000);

    setInterval(async () => {
      let pageLength = (await context.pages()).length;
      console.log("so du lieu can get chi tiet", linkArrayAfterCheck.length);

      if (pageLength < tabMaxConfig) {
        if (arrSpecial.length > 0) {
          console.log("arrSpecial", arrSpecial);
          const dataLink = arrSpecial.pop();
          const checkLink = await checkLinkArray(dataLink);
          if (checkLink) {
            const page = await context.newPage();

            // console.log(" get chi tiet du lieu dac biet", checkLink);
            getDetailSpecial(page, checkLink, dataArray);
          }
        }
      }
    }, 1 * 2000);

    // // c?? linkArray   => c???n check ph???n t??? c?? trong db ch??a
    // // n???u c?? r???i ch??? c???n l??u v??o b???ng bidsSearchTerms m?? kh??ng c???n qu??t l???i
    // // ch??a c?? => l??u v??o m???ng linkArrayAfterCheck ????? l???y detail
    setInterval(async () => {
      // console.log("so luong can lay chi tiet", linkArray.length);
      if (linkArray.length > 0) {
        // console.log("1", linkArray);
        // check v?? l??u v??o linkArrayAfterCheck
        const links = [];
        const link = linkArray.pop();

        const checkLink = await checkLinkArray(link);
        if (checkLink) linkArrayAfterCheck.push(checkLink);
      }
    }, 1 * 1000);

    const urlDownloadAray = [];

    setInterval(async () => {
      let pageLength = (await context.pages()).length;
      console.log(
        "so du lieu chi tiet get chi tiet",
        linkArrayAfterCheck.length
      );
      // console.log("check arr", linkArrayAfterCheck);

      if (pageLength < tabMaxConfig) {
        if (linkArrayAfterCheck.length > 0) {
          const dataLink = linkArrayAfterCheck.pop();
          const page = await context.newPage();

          // console.log(" du lieu get chi tiet", dataLink);
          getDetails(page, dataLink, dataArray, urlDownloadAray);
        }
      }
    }, 1 * 2000);

    const checkResult = [];
    setInterval(async () => {
      // console.log("so du lieu chi tiet can luu vao db", dataArray.length);
      if (dataArray.length > 0) {
        const data = dataArray.pop();
        // console.log("du lieu vao db", data);
        pushData(data, checkResult);
        // console.log("c?? d??? li???u v??o, l??u db", data);
        // l??u db
      }
    }, 1 * 500);

    setInterval(async () => {
      let pageLength = (await context.pages()).length;
      // console.log("so du lieu can download", urlDownloadAray.length);
      if (
        (pageLength < tabMaxConfig &&
          dataArray === [] &&
          linkArrayAfterCheck === [] &&
          arrSpecial === [] &&
          optionSearchLoop === [],
        optionSearchList === [])
      ) {
        if (urlDownloadAray.length > 0 && checkResult.length > 0) {
          checkResult.pop();
          const urlDownload = urlDownloadAray.pop();
          const newPage = await context.newPage();
          downloadWithURL(newPage, urlDownload);
        }
      }
    }, 1 * 2000);
  });
};
main().then((result) => {});
//   },
//   null,
//   true,
//   "Asia/Ho_Chi_Minh"
// );
