import "./env";
// import "./db";
import puppeteer from "puppeteer";
import searchAndGetLink from "./services/searchAndGetLink";
import getDetails from "./services/getDetails";
import checkSearch from "./services/checkSearch";
import checkLinkArray from "./services/checkLinkArray";
// import { muasam } from "./services/muasam";
import moment from "moment";
import path from "path";
import configs from "./configs";
import _ from "lodash";
import fs from "fs";
import pushData from "./services/pushData";
import test from "./services/test";
import downloadWithURL from "./services/downloadWithURL";
import getDetailSpecial from "./services/getDetailSpecial";
import { timeEnd } from "console";
const logEvents = require("./utils/logEvents");
const notifySlack = require("./services/testSlack");

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
        // chưa đến tgian bắt đầu
        waitTime =
          timeStart.split(":")[0] * 60 +
          timeStart.split(":")[1] * 1 -
          (currentTime.split(":")[0] * 60 + currentTime.split(":")[1] * 1); //tgian chờ tính theo phút
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
          (currentTime.split(":")[0] * 60 + currentTime.split(":")[1] * 1); //tgian chờ tính theo phút
      } else {
        // chưa đến tgian bắt đầu
        waitTime =
          timeStart.split(":")[0] * 60 +
          timeStart.split(":")[1] * 1 -
          (currentTime.split(":")[0] * 60 + currentTime.split(":")[1] * 1); //tgian chờ tính theo phút
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
    const optionSearchList = []; // chứa các điều kiện tìm kiêmr ( tức thời đc lên trc, vòng lặp cho phía sau)
    const searchTermsRS = []; // chứa các điều kiện tìm kiếm tức thời
    const searchLoop = []; // chứa các điều kiện tìm kiếm lặp
    const optionSearchLoop = [];

    // gọi hàm lấy searchTerms status = 1 và checkStatus  =0
    await checkSearch(searchTermsRS, searchLoop);
    // lấy xong => cậpnhật checkStatus = 1
    optionSearchList.unshift(...searchTermsRS); // điều kiện tức thời dc đưa lên đầu
    optionSearchSchedule.push(...searchLoop); // điều kiện lặp đc cho xuống cuối

    // lấy điều kiện tìm kiếm từ db
    // cứ một khoảng thời gian lại quét, xem có điều kiện tìm kiếm mới được khởi tạo không
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

    // vòng lặp tạo lịch cho điều kiện tìm kiếm
    setInterval(async () => {
      // console.log("optionSearchSchedule", optionSearchSchedule);

      if (optionSearchSchedule.length > 0) {
        console.log("optionSearchSchedule.length", optionSearchSchedule.length);
        // const page = await context.newPage();
        const optionSearch = optionSearchSchedule.shift();

        const timeStart = new Date(optionSearch.loopStartTime);
        const endTime = new Date(optionSearch.loopStartEnd);

        if (Number(optionSearch.loopType) === 2) {
          // lặp các ngày trong tuần
          // nếu chưa có vòng lặp trong searchTeamInterval hoặc có rồi mà có thay đổi điều kiện tìm (checkStatus=0)
          // => xóa cũ và tạo vòng lặp mới
          if (
            !searchTeamInterval[optionSearch.id] ||
            Number(optionSearch.checkStatus === 0)
          ) {
            searchTeamLoopString[optionSearch.id] =
              JSON.stringify(optionSearch);
            // push điều kiện tìm vào optionSearchList nếu ngày hôm nay thỏa mãn
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
                console.log("xóa e");
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
                  0: "Tức thời",
                  1: "Theo giờ",
                  2: "Theo ngày",
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
              }
            }, 1 * 24 * 60 * 60 * 1000);

            if (searchTeamInterval[optionSearch.id]) {
              searchTeamInterval[optionSearch.id].push(loop);
            } else {
              searchTeamInterval[optionSearch.id] = [loop];
            }

            // tạo vòng lặp để push điều kiện tìm kiếm vào optionSearchList, bắt đầu từ ngày mai
          }
        } else if (Number(optionSearch.loopType) === 1) {
          // => xóa cũ và tạo vòng lặp mới
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
                console.log("xóa e");
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
                  0: "Tức thời",
                  1: "Theo giờ",
                  2: "Theo ngày",
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
              }
            }, interval);

            if (searchTeamInterval[optionSearch.id]) {
              searchTeamInterval[optionSearch.id].push(loop);
            } else {
              searchTeamInterval[optionSearch.id] = [loop];
            }

            // tạo vòng lặp để push điều kiện tìm kiếm vào optionSearchList,bắt đầu  interval giây sau
          }
        }
      }
    }, 1 * 10 * 1000);

    // có điều kiện tìm kiếm
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

          // lấy phần tử đầu tiên trong mảng
          const optionSearch = optionSearchList.shift();

          searchAndGetLink(page, optionSearch, linkArray, arrSpecial);
        } else if (optionSearchLoop.length > 0) {
          const page = await context.newPage();

          // lấy phần tử đầu tiên trong mảng
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

    // // có linkArray   => cần check phần tử có trong db chưa
    // // nếu có rồi chỉ cần lưu vào bảng bidsSearchTerms mà không cần quét lại
    // // chưa có => lưu vào mảng linkArrayAfterCheck để lấy detail
    setInterval(async () => {
      console.log("so luong can lay chi tiet", linkArray.length);
      if (linkArray.length > 0) {
        // console.log("1", linkArray);
        // check và lưu vào linkArrayAfterCheck
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
        // console.log("có dữ liệu vào, lưu db", data);
        // lưu db
      }
    }, 1 * 500);

    setInterval(async () => {
      let pageLength = (await context.pages()).length;
      console.log("so du lieu can download", urlDownloadAray.length);
      if (pageLength < tabMaxConfig) {
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
