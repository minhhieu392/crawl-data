import "./env";
import "./db";
import puppeteer from "puppeteer";
import {
  vietnambizCategory,
  vietnambizNewDetail,
} from "./services/vietnambizServices";
import { muasam } from "./services/muasam";
import { categoryService, detailService } from "./services/index";
import getNewsCategoryUrls from "./services/getNewsCategoryUrls";
import newspapersService from "./services/db/newspapersService";
const emitter = require("events").EventEmitter;
const bot = new emitter();
import path from "path";
import configs from "./configs";
import _ from "lodash";
import fs, { rmSync } from "fs";
import { url } from "inspector";
import news from "./entity/news";

const numberOfGetInfoWokers = Number(configs["NUMBER_OF_GET_INFO_WORKERS"]);
if (!fs.existsSync(path.resolve(process.cwd(), configs["STORAGE_FOLDER"]))) {
  fs.mkdirSync(path.resolve(process.cwd(), configs["STORAGE_FOLDER"]));
}
if (!fs.existsSync(path.resolve(process.cwd(), configs["PROFILES_FOLDER"]))) {
  fs.mkdirSync(path.resolve(process.cwd(), configs["PROFILES_FOLDER"]));
}
let queueStatus = true;
let keywords = [];
if (configs["KEY_WORDS"] && configs["KEY_WORDS"].split(",")) {
  keywords = configs["KEY_WORDS"].split(",").map((el) => {
    return el.trim();
  });
}
let userLinks = [];
let groupLinks = [];

const main = () => {
  /*const userDataPath = path.resolve(
        process.cwd(),
        configs["PROFILES_FOLDER"],
        configs["PROFILE"]
      );
      console.log("userDataPath==", userDataPath);
      console.log(userDataPath);
      */
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
      executablePath: configs.CHROME_PATH,
    };
    const browser = await puppeteer.launch(launchOption);
    const pageSizeConfig = 1;
    const tabMaxConfig = 4;
    const param = {
      // filter: {status:true,id:"8"},
      filter: { status: true },
    };

    let classifyKeyWord = [
      {
        id: 1,
        name: "Sức khỏe",
        keyword: ["Món ngon cho sức khỏe", "sức khỏe"],
      },
      {
        id: 2,
        name: "Thể Thao",
        keyword: ["Bóng đã", "cầu lông"],
      },
    ];

    let newsCategoryUrls = [];
    let newsDetailUrls = [];
    let context = await browser.createIncognitoBrowserContext();
    let checkUrlArray = [];
    //init ban đầu
    // let newspapersData = await newspapersService.get_list(param);
    // console.log("newspapersData", newspapersData);

    // let CategoryUrls = getNewsCategoryUrls(newspapersData.rows, pageSizeConfig);
    // // console.log(CategoryUrls);
    // // console.log(newspapersData);
    // newsCategoryUrls = newsCategoryUrls.concat(CategoryUrls);

    // // Lấy link các thể loại báo từ databse
    // // Load lại type key word ,disater
    // setInterval(async () => {
    //   // cập nhật lại thời gian quét báo lần cuối cùng
    //   await newspapersService.updateLastTrackTimeForMany(checkUrlArray);

    //   newspapersData = await newspapersService.get_list(param);
    //   console.log("newspapersData", newspapersData);
    //   CategoryUrls = getNewsCategoryUrls(newspapersData.rows, pageSizeConfig);
    //   // console.log(CategoryUrls);
    //   // console.log(newspapersData);
    //   newsCategoryUrls = newsCategoryUrls.concat(CategoryUrls);
    // }, 4 * 60 * 60 * 1000);

    // // làm mới mảng check url đã được lấy dữ liệu chưa
    // setInterval(async () => {
    //   checkUrlArray = newsDetailUrls.slice();
    // }, 48 * 60 * 60 * 1000);

    // // lấy các link báo
    // setInterval(async () => {
    //   let pageLength = (await context.pages()).length;
    //   if (pageLength < tabMaxConfig) {
    //     if (newsCategoryUrls.length > 0) {
    //       let element = newsCategoryUrls.splice(0, 1);
    //       console.log("newsCategoryUrls.length=", newsCategoryUrls.length);
    //       console.log(
    //         `open link: ${element[0].url} page = ${element[0].pagesize}`
    //       );
    //       categoryService[`${element[0].key}`](
    //         context,
    //         element[0].url,
    //         element[0].pagesize,
    //         element[0].id,
    //         element[0].keyword,
    //         element[0].key,
    //         newsDetailUrls,
    //         element[0].categoriesId,
    //         checkUrlArray,
    //         element[0].lastTrackTime
    //       );
    //     }
    //   }
    // }, 1 * 1000);

    // // lấy dữ liệu bài báo
    // setInterval(async () => {
    //   let pageLength = (await context.pages()).length;
    //   if (pageLength < tabMaxConfig) {
    //     if (newsDetailUrls.length > 0) {
    //       let elementDetail = newsDetailUrls.splice(0, 1);
    //       console.log("checkUrlArray.length=", checkUrlArray.length);
    //       console.log("newsDetailUrls.length=", newsDetailUrls.length);
    //       console.log(`open link Detail: ${elementDetail[0].link} `);
    //       detailService[`${elementDetail[0].key}`](
    //         context,
    //         elementDetail[0].link,
    //         elementDetail[0]._newsPapersId,
    //         elementDetail[0].item,
    //         classifyKeyWord
    //       );
    //     }
    //   }
    // }, 1 * 1000);

    // //  // test;
    // cafeCategory(
    //   context,
    //   "https://cafef.vn/thoi-su.chn",
    //   1,
    //   26,
    //   ["a", "b", "c"],
    //   "laodong",
    //   []
    // );
    muasam;
    // vietnambizNewDetail(
    //   context,
    //   "https://vietnambiz.vn/cuoc-dua-san-xuat-thuoc-tri-covid-19-nong-len-toan-cau-voi-nhieu-ung-cu-vien-sang-gia-20210726172828364.htm",
    //   56,
    //   {
    //     newsTitle:
    //       "Cuộc đua sản xuất thuốc trị COVID-19 nóng lên toàn cầu với nhiều ứng cử viên sáng giá",
    //     newsShortDescription: `Bộ Tài chính chỉ đạo khẩn trương báo cáo việc áp dụng giao dịch lô tối thiểu 10 cổ phiếu như trước đây để đảm bảo quyền lợi cho nhà đầu tư.`,
    //     image:
    //       "https://cafefcdn.com/zoom/250_156/203337114487263232/2021/7/26/photo1627299194845-162729919496288206143.jpg",
    //     time: "2021-07-26T18:35:00",
    //   }
    // );
  });
};
main().then((result) => {
  // console.log(result);
});
