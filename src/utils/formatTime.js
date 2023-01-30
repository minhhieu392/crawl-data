import moment from "moment";
import _ from "lodash";
// const _ = require("lodash");
// const moment = require("moment");

const mapObj = {
  MỘT: "01",
  HAI: "02",
  BA: "03",
  BỐN: "04",
  NĂM: "05",
  SÁU: "06",
  BẢY: "07",
  TÁM: "08",
  CHÍN: "09",
  MƯỜI: "10",
  "MƯỜI MỘT": "11",
  "MƯỜI HAI": "12",
  JANUARY: "01",
  JAN: "01",
  FEBRUARY: "02",
  FEB: "02",
  MARCH: "03",
  MAR: "03",
  APRIL: "04",
  APR: "04",
  MAY: "05",
  JUNE: "06",
  JUN: "06",
  JULY: "07",
  JUL: "07",
  AUGUST: "08",
  AUG: "08",
  SEPTEMBER: "09",
  SEP: "09",
  OCTOBER: "10",
  OCT: "10",
  NOVEMBER: "11",
  NOV: "11",
  DECEMBER: "12",
  DEC: "12",
};
const filterTime = (stringTime) => {
  return stringTime
    .replace(/&nbsp;/gims, "")
    .toUpperCase()
    .trim()
    .replace(
      /\b(?:THỨ 2|THỨ 3|THỨ 4|THỨ 5|THỨ 6|THỨ 7|CHỦ NHẬT|THỨ HAI|THỨ BA|THỨ TƯ|THỨ BỐN|THỨ NĂM|THỨ LĂM|THỨ SÁU|THỨ BẢY|THỨ2|THỨ3|THỨ4|THỨ5|THỨ6|THỨ7|CHỦNHẬT|THỨHAI|THỨBA|THỨTƯ|THỨBỐN|THỨNĂM|THỨLĂM|THỨSÁU|THỨBẢY|SUNDAY|SUN|MONDAY|MON|TUESDAY|TUE|WEDNESDAY|WED|THURSDAY|THU|FRIDAY|FRI |GMT|AM|PM|UTC|UPDATED|UPDATE|CẬP NHẬT|BST|THÁNG|NĂM)\b/gi,
      ""
    )
    .replace("THỨ TƯ", "")

    .replace(/\b,/gim, " ")
    .replace(/\(.*?\)/gim, "")
    .replace(/  /gims, " ")
    .replace(
      /\b(?:MỘT|HAI|BA|BỐN|NĂM|SÁU|BẢY|TÁM|CHÍN|MƯỜI|MƯỜI MỘT|MƯỜI HAI|JAN|JANUARY|FEBRUARY|FEB|MARCH|APRIL|APR|MAY|JUNE|JUN|JULY|JUL|AUGUST|AUG|SEPTEMBER|SEP|OCTOBER|OCT|NOVEMBER|NOV|DECEMBER|DEC)\b/gi,
      (matched) => mapObj[matched]
    );
};

const timeElementSort = (stringTime, timeSeparation) => {
  let arrayTime = stringTime.split(timeSeparation);
  let yearIndex = arrayTime.findIndex((e) => (e >= 2000) & (e <= 2300));
  if (yearIndex != -1) {
    if (
      //DDMMYYYY
      arrayTime[yearIndex - 2] >= 1 &&
      arrayTime[yearIndex - 2] <= 30 &&
      arrayTime[yearIndex - 1] >= 1 &&
      arrayTime[yearIndex - 1] <= 12
    ) {
      return new Date(
        arrayTime[yearIndex],
        arrayTime[yearIndex - 1] - 1,
        arrayTime[yearIndex - 2]
      );
    } else if (
      //YYYYMMDD
      arrayTime[yearIndex + 2] >= 1 &&
      arrayTime[yearIndex + 2] <= 30 &&
      arrayTime[yearIndex + 1] >= 1 &&
      arrayTime[yearIndex + 1] <= 12
    ) {
      return new Date(
        arrayTime[yearIndex],
        arrayTime[yearIndex + 1] - 1,
        arrayTime[yearIndex + 2]
      );
    }
  } else {
    //not year MMDD
    let today = new Date();
    let newsDate;
    if (
      new Date(
        today.getFullYear(),
        arrayTime[arrayTime.length - 2] - 1,
        arrayTime[arrayTime.length - 1]
      ) <= new Date()
    ) {
      newsDate = new Date(
        today.getFullYear(),
        arrayTime[arrayTime.length - 2] - 1,
        arrayTime[arrayTime.length - 1]
      );
    } else {
      newsDate = new Date(
        today.getFullYear() - 1,
        arrayTime[arrayTime.length - 2] - 1,
        arrayTime[arrayTime.length - 1]
      );
    }
    return newsDate;
  }
};

const formatTime = (stringTime, caseTime = 0) => {
  //case 2 for  ...MM DD YYYY    && "ago" && MMDD
  //case 1 for  YYYYMMDD... && DDMMMMYYY...
  //case 1 "2 ngày trước" "ago" && MMDD  &&   agree format moment
  //case 1 05:30  (hh:mm)
  //case 0 for agree format moment   2021-04-26T10:51:00-0400 2021-04-03

  let arrayTime, timeCorrectFormat, timeFinal;
  if (stringTime === null) {
    timeFinal = new Date();
  } else {
    stringTime = filterTime(stringTime);
    arrayTime = stringTime.split(" ");
    arrayTime = _.remove(arrayTime, function (e) {
      return e !== "";
    });

    switch (caseTime) {
      case 0:
        timeFinal = stringTime;
        break;
      case 1:
        // ...YYYYMMDD... && ...DDMMMMYYY... && "ago" && MMDD  // 7 giờ trước
        // 14-05-2021 - 01:45
        // 13 May 2021  // April 29
        //05/05/2021 - 17:33
        //13 05 2021
        // cách đây , trước ...
        if (
          (stringTime.includes(":") && stringTime.length <= 5) ||
          stringTime.includes("AGO") ||
          stringTime.includes("TIẾNG TRƯỚC") ||
          stringTime.includes("GIỜ TRƯỚC") ||
          stringTime.includes("PHÚT TRƯỚC") ||
          stringTime.includes("NGÀY TRƯỚC") ||
          stringTime.includes("CÁCH ĐÂY")
        ) {
          if (
            stringTime.includes(":") ||
            stringTime.includes("MIN") ||
            stringTime.includes("HOUR") ||
            stringTime.includes("GIỜ") ||
            stringTime.includes("TIẾNG") ||
            stringTime.includes("PHÚT")
          ) {
            timeFinal = new Date();
          } else if (
            stringTime.includes("DAY") ||
            stringTime.includes("NGÀY")
          ) {
            let index = arrayTime.findIndex(
              (element) => element == "DAY" || element == "DAYS"
            );
            timeFinal = moment()
              .subtract(arrayTime[index - 1], "days")
              .format("YYYY-MM-DD");
          }
        } else if (
          !stringTime.includes(" ") &&
          !stringTime.includes("/") &&
          !stringTime.includes(",") &&
          !stringTime.includes("-")
        ) {
          timeFinal = stringTime;
        } else if ([...stringTime.matchAll("/")].length) {
          timeCorrectFormat = arrayTime.find(
            (element) => element.includes("/") && element.length >= 6
          );
          timeFinal = timeElementSort(timeCorrectFormat, "/");
        } else if ([...stringTime.matchAll("-")].length) {
          timeCorrectFormat = arrayTime.find(
            (element) => element.includes("-") && element.length >= 6
          );

          timeFinal = timeElementSort(timeCorrectFormat, "-");
        } else {
          timeFinal = timeElementSort(stringTime, " ");
        }
        break;
      case 2:
        //case 2 for  ...MM DD YYYY
        //Updated 2033 GMT (0618 HKT) May 11, 2021

        if (
          stringTime.includes("AGO") ||
          stringTime.includes("TIẾNG TRƯỚC") ||
          stringTime.includes("GIỜ TRƯỚC") ||
          stringTime.includes("PHÚT TRƯỚC") ||
          stringTime.includes("NGÀY TRƯỚC")
        ) {
          if (
            stringTime.includes("MIN") ||
            stringTime.includes("HOUR") ||
            stringTime.includes("GIỜ") ||
            stringTime.includes("TIẾNG") ||
            stringTime.includes("PHÚT")
          ) {
            timeFinal = new Date();
          } else if (
            stringTime.includes("DAY") ||
            stringTime.includes("NGÀY")
          ) {
            let index = arrayTime.findIndex(
              (element) => element == "DAY" || element == "DAYS"
            );
            timeFinal = moment()
              .subtract(arrayTime[index - 1], "days")
              .format("YYYY-MM-DD");
          }
        } else {
          let yearIndexs = arrayTime.reduce(function (a, e, i) {
            if ((e >= 2000) & (e <= 2300)) a.push(i);
            return a;
          }, []);
          let yearIndex = yearIndexs[yearIndexs.length - 1];
          if (
            // MM DD YYYY
            arrayTime[yearIndex - 2] >= 1 &&
            arrayTime[yearIndex - 2] <= 12 &&
            arrayTime[yearIndex - 1] >= 1 &&
            arrayTime[yearIndex - 1] <= 30
          ) {
            timeFinal = new Date(
              arrayTime[yearIndex],
              arrayTime[yearIndex - 2] - 1,
              arrayTime[yearIndex - 1]
            );
          }
        }

        break;
      default:
      // code block
    }
  }

  // return moment(timeFinal).format("YYYY-MM-DD");
  return moment(timeFinal).add(-7, "hours");
};

export default formatTime;

//case 0
//tienphong     2021-05-14T06:47:00+0700
//cbsnews       2021-04-26T10:51:00-0400
//euro          2021-04-03
//indepent      2021-05-11T10:42:47.000Z
//nbcnews       2021-03-16T09:00:00.000Z

//case 1
//vietnamnet    14/05/2021 13:33:20
//nld           14-05-2021 - 01:45
//dantri        05/05/2021 - 17:33\
//channelnewsasiaService 15 May 2021 06:01AM

//case 1
//tuoitre       13 05 2021
//newTrusOrg    7 05 2021
//editon        0342   05 14 2021

//case 1
//theguardian   12 05 2021 05.01
// case 1
//foxnews       2 days ago
//foxnews       April 29

//case 2:     MMDDYYYY
//editon        0342 05 14 2021    Updated 2218 GMT (0618 HKT) May 11, 2021
