import "./env";
// import "./db";
import puppeteer from "puppeteer";
import searchAndGetLink from "./services/searchAndGetLink";
import getDetails from "./services/getDetails";
import checkSearch from "./services/checkSearch";
import checkLinkArray from "./services/checkLinkArray";
// import { muasam } from "./services/muasam";

import path from "path";
import configs from "./configs";
import _ from "lodash";
import fs from "fs";
import pushData from "./services/pushData";
import test from "./services/test";
import downloadWithURL from "./services/downloadWithURL";
const logEvents = require("./utils/logEvents");

// const arrData = [
//   709, 111, 113, 115, 511, 117, 711, 713, 715, 717, 201, 203, 401, 403, 601,
//   205, 207, 801, 405, 603, 209, 407, 803, 605, 606, 805, 409, 807, 809, 211,
//   213, 411, 215, 217, 811, 219, 813, 815, 816, 817, 819, 221, 101, 223, 103,
//   301, 225, 302, 303, 501, 821, 305, 503, 701, 107, 823, 109, 703, 505, 507,
//   705, 509, 707,
// ];
// test(arrData);

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
// const job = new cron.CronJob(
//   "50 9 * * *",
//   function () {
//     console.log("Running the job");
function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const waitToStartTime = async (timeStart, { loopType, repetitionHours }) => {
  let waitTime = 0;
  if (timeStart) {
    if (Number(loopType) === 1) {
      const currentTime = moment().format("HH:mm");

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

  await timeout(waitTime * 60 * 1000);
  return;
};

const main = () => {
  return new Promise(async (resolve, reject) => {
    const args = [
      // "--incognito",
      // "--window-position=0,0",
      // "--ignore-certifcate-errors",
      // "--ignore-certifcate-errors-spki-list",
      // "--remote-debugging-port=9222",
      // "--no-sandbox",
      // "--disable-gpu",
      // "--disable-accelerated-2d-canvas",
      // "--disable-setuid-sandbox",
      // "--ignore-certificate-errors",
      // "--headless",
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

    // const linkArray = [];
    // const dataArray = [];

    const tabMaxConfig = configs["TABMAX"];

    // const optionSearchSchedule = [];
    // const optionSearchList = []; // ch???a c??c ??i???u ki???n t??m ki??mr ( t???c th???i ??c l??n trc, v??ng l???p cho ph??a sau)
    // const searchTermsRS = []; // ch???a c??c ??i???u ki???n t??m ki???m t???c th???i
    // const searchLoop = []; // ch???a c??c ??i???u ki???n t??m ki???m l???p

    // // g???i h??m l???y searchTerms status = 1 v?? checkStatus  =0
    // await checkSearch(searchTermsRS, searchLoop);
    // // l???y xong => c???pnh???t checkStatus = 1
    // optionSearchList.unshift(...searchTermsRS); // ??i???u ki???n t???c th???i dc ????a l??n ?????u
    // optionSearchSchedule.push(...searchLoop); // ??i???u ki???n l???p ??c cho xu???ng cu???i

    // // l???y ??i???u ki???n t??m ki???m t??? db
    // // c??? m???t kho???ng th???i gian l???i qu??t, xem c?? ??i???u ki???n t??m ki???m m???i ???????c kh???i t???o kh??ng
    // setInterval(async () => {
    //   const newSearchTermsRS = [];
    //   const newSearchLoop = [];
    //   await checkSearch(newSearchTermsRS, newSearchLoop);
    //   // console.log(newSearchTermsRS);
    //   optionSearchList.unshift(...newSearchTermsRS);
    //   optionSearchSchedule.push(...newSearchLoop);
    //   optionSearchList.push(...newSearchTermsRS);
    // }, 1 * 1000 * 60);

    // const searchTeamInterval = {};

    // // v??ng l???p t???o l???ch cho ??i???u ki???n t??m ki???m
    // setInterval(async () => {
    //   // console.log("optionSearchSchedule", optionSearchSchedule);

    //   if (optionSearchSchedule.length > 0) {
    //     // const page = await context.newPage();
    //     const optionSearch = optionSearchSchedule.unshift();
    //     const startTime = new Date(optionSearch.loopStartTime);
    //     const endTime = new Date(optionSearch.loopStartEnd);
    //     let now = new Date();

    //     if (Number(optionSearch.loopType) === 2) {
    //       // l???p c??c ng??y trong tu???n
    //       // n???u ch??a c?? v??ng l???p trong searchTeamInterval ho???c c?? r???i m?? c?? thay ?????i ??i???u ki???n t??m (checkStatus=0)
    //       // => x??a c?? v?? t???o v??ng l???p m???i
    //       if (
    //         !searchTeamInterval[optionSearch.id] ||
    //         Number(optionSearch.checkStatus === 0)
    //       ) {
    //         if (searchTeamInterval[optionSearch.id]) {
    //           clearInterval(searchTeamInterval[optionSearch.id]);
    //         }

    //         // push ??i???u ki???n t??m v??o optionSearchList n???u ng??y h??m nay th???a m??n
    //         await waitToStartTime(optionSearch.startTime, {
    //           loopType: optionSearch.loopType,
    //         });
    //         if (days.includes(today) && now >= startTime && now <= endTime) {
    //           optionSearchList.push(optionSearch);
    //           // console.log("optionSearchList 2", optionSearchList);
    //         }

    //         // t???o v??ng l???p ????? push ??i???u ki???n t??m ki???m v??o optionSearchList, b???t ?????u t??? ng??y mai
    //         const loop = setInterval(async () => {
    //           console.log("1");
    //           const days = optionSearch.weekdays;
    //           let today = new Date().getDay();
    //           // console.log("3", days);
    //           if (days.includes(today) && now >= startTime && now <= endTime) {
    //             optionSearchList.push(optionSearch);
    //             console.log("optionSearchList 2", optionSearchList);
    //           } else if (now > endTime) {
    //             clearInterval(searchTeamInterval[optionSearch.id]);
    //           }
    //         }, 1 * 24 * 60 * 60 * 1000);
    //         searchTeamInterval[optionSearch.id] = loop;
    //       }
    //     } else if (Number(optionSearch.loopType) === 1) {
    //       // l???p theo gi???
    //       // n???u ch??a c?? v??ng l???p trong searchTeamInterval ho???c c?? r???i m?? c?? thay ?????i ??i???u ki???n t??m (checkStatus=0)
    //       // => x??a c?? v?? t???o v??ng l???p m???i
    //       const repetitionHours = optionSearchSchedule.repetitionHours || 24;
    //       const interval = repetitionHours * 60 * 60 * 1000;

    //       if (
    //         !searchTeamInterval[optionSearch.id] ||
    //         Number(optionSearch.checkStatus === 0)
    //       ) {
    //         if (searchTeamInterval[optionSearch.id]) {
    //           clearInterval(searchTeamInterval[optionSearch.id]);
    //         }

    //         await waitToStartTime(optionSearch.startTime, {
    //           loopType: optionSearch.loopType,
    //           repetitionHours: repetitionHours,
    //         });
    //         // push ??i???u ki???n t??m v??o optionSearchList n???u th???i ??i???m n??y th???a m??n
    //         if (days.includes(today) && now >= startTime && now <= endTime) {
    //           optionSearchList.push(optionSearch);
    //         }

    //         // t???o v??ng l???p ????? push ??i???u ki???n t??m ki???m v??o optionSearchList,b???t ?????u  interval gi??y sau
    //         const loop = setInterval(async () => {
    //           if (now >= startTime && now <= endTime) {
    //             optionSearchList.push(optionSearch);
    //           } else if (now > endTime) {
    //             clearInterval(searchTeamInterval[optionSearch.id]);
    //           }
    //         }, interval);
    //         searchTeamInterval[optionSearch.id] = loop;
    //       }
    //     }
    //   }
    // }, 1 * 5000);

    // // c?? ??i???u ki???n t??m ki???m
    // // => get listLink  =>linkArray
    // const linkArrayAfterCheck = [];

    // setInterval(async () => {
    //   let pageLength = (await context.pages()).length;

    //   if (pageLength < tabMaxConfig) {
    //     if (optionSearchList.length > 0) {
    //       // console.log("dataLink", dataLink.links);
    //       const page = await context.newPage();

    //       // l???y ph???n t??? ?????u ti??n trong m???ng
    //       const optionSearch = optionSearchList.shift();

    //       searchAndGetLink(page, optionSearch, linkArray);
    //     }
    //   }
    // }, 1 * 3000);

    // // // c?? linkArray   => c???n check ph???n t??? c?? trong db ch??a
    // // // n???u c?? r???i ch??? c???n l??u v??o b???ng bidsSearchTerms m?? kh??ng c???n qu??t l???i
    // // // ch??a c?? => l??u v??o m???ng linkArrayAfterCheck ????? l???y detail
    // setInterval(async () => {
    //   console.log("s??? l?????ng  c???n l???y chi ti???t", linkArray.length);
    //   if (linkArray.length > 0) {
    //     // console.log("1", linkArray);
    //     // check v?? l??u v??o linkArrayAfterCheck
    //     const links = [];
    //     const link = linkArray.pop();

    //     const checkLink = await checkLinkArray(link);
    //     if (checkLink) linkArrayAfterCheck.push(checkLink);
    //   }
    // }, 1 * 1000);

    const urlDownloadAray = [
      {
        urlPath:
          "https://muasamcong.mpi.gov.vn/egp/contractorfe/viewer?formCode=ALL&id=c722fe02-e23a-4446-84ff-46f0303211ac&fileName=H%E1%BB%93%20s%C6%A1%20m%E1%BB%9Di%20th%E1%BA%A7u",
      },
    ];

    // setInterval(async () => {
    //   let pageLength = (await context.pages()).length;
    //   console.log(
    //     "s??? d??? li???u chi ti???t get chi ti???t",
    //     linkArrayAfterCheck.length
    //   );

    //   if (pageLength < tabMaxConfig) {
    //     if (linkArrayAfterCheck.length > 0) {
    //       const dataLink = linkArrayAfterCheck.pop();
    //       const page = await context.newPage();

    //       console.log(" d??? li???u get chi ti???t", dataLink);
    //       getDetails(page, dataLink, dataArray, urlDownloadAray);
    //     }
    //   }
    // }, 1 * 3000);

    setInterval(async () => {
      let pageLength = (await context.pages()).length;
      console.log("s??? d??? li???u c???n dowload", urlDownloadAray.length);
      if (pageLength < tabMaxConfig) {
        if (urlDownloadAray.length > 0) {
          const urlDownload = urlDownloadAray.pop();
          const newPage = await context.newPage();
          // console.log("d??? li???u dowload", urlDownload);
          downloadWithURL(newPage, urlDownload);
        }
      }
    }, 1 * 3000);

    // setInterval(async () => {
    //   console.log("s??? d??? li???u chi ti???t c???n l??u v?? db", dataArray.length);
    //   if (dataArray.length > 0) {
    //     const data = dataArray.pop();
    //     console.log("d??? li???u l??u v?? db", data);
    //     pushData(data);
    //     // console.log("c?? d??? li???u v??o, l??u db", data);
    //     // l??u db
    //   }
    // }, 1 * 1000);
  });
};
main().then((result) => {});
//   },
//   null,
//   true,
//   "Asia/Ho_Chi_Minh"
// );
