import puppeteer, { launch } from "puppeteer";
const configs = require("../configs");
import fs from "fs";
import path from "path";
import _ from "lodash";
import formatTime from "../utils/formatTime";
import newsService from "./db/newsService";
import articleService from "./db/articleService";
import urlRewrite from "../utils/urlRewire";
import jsdom from "jsdom";
import checkBeforePush from "../utils/checkBeforePush";
//buton paginationAndreload ==0

const vietstockCategory = async (
  context,
  link,
  pageSize,
  newspapersId,
  keywords,
  key,
  newsCategoryUrls,
  categoriesId,
  checkUrlArray,
  lastTrackTime
) => {
  let strRegex = _.chain(keywords)
    .map((n) => {
      return "(" + n.toUpperCase() + ")";
    })
    .join("|")
    .value();
  strRegex = "&&&&&&&1&&&&&|" + strRegex + "|&&&&&&&1&&&&&";
  let evalVar = {
    strRegex: strRegex,
    pageSize: pageSize,
    categoriesId: categoriesId,
  };
  const page = await context.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  await page.goto(link, {
    waitUntil: "load",
    // Remove the timeout
    // timeout: Number(configs["PAGE_GOTO_TIMEOUT"]),
    timeout: 0,
  });

  await page.content();

  await page.waitForTimeout(5000);
  console.log("evalVar", evalVar);
  await page
    .evaluate(async (evalVar) => {
      return await new Promise(async (__resolve, __reject) => {
        // console.log("strRegex==",evalVar.strRegex)
        /**/
        let num = 0;
        let ar_title = [];
        let timerId = setInterval(() => {
          if (Number(num) < Number(evalVar.pageSize)) {
            let news = document.evaluate(
              "//div[@id='channel-container']/section",
              document,
              null,
              XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
              null
            );

            // ar_title.push({
            //   length: news ? news.snapshotLength : null,
            // });

            // // return __resolve({
            // //   lengt2: news ? news.snapshotLength : "a",
            // // });
            for (let i = 0, length = news.snapshotLength; i < length; ++i) {
              // /html/body/section[5]/div[1]/div[3]/article[16]
              let title = document.evaluate(
                "./div/div/div[2]/h2/a",
                news.snapshotItem(i),
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
              ).singleNodeValue;
              if (
                title &&
                title.innerText
                  .trim()
                  .toUpperCase()
                  .match("/" + evalVar.strRegex + "/")
              ) {
                let image = document.evaluate(
                  "./div/div/div[1]/div/a/img",

                  news.snapshotItem(i),
                  null,
                  XPathResult.FIRST_ORDERED_NODE_TYPE,
                  null
                ).singleNodeValue;
                let newsShortDescription = document.evaluate(
                  "./div/div/div[2]/p",
                  news.snapshotItem(i),
                  null,
                  XPathResult.FIRST_ORDERED_NODE_TYPE,
                  null
                ).singleNodeValue;
                let time = document.evaluate(
                  "./div/div/div[2]/div/span",
                  news.snapshotItem(i),
                  null,
                  XPathResult.FIRST_ORDERED_NODE_TYPE,
                  null
                ).singleNodeValue;
                ar_title.push({
                  newsTitle: title ? title.innerText : "",
                  href: title
                    ? title.getAttribute("href").includes("http")
                      ? title.getAttribute("href")
                      : "https://vietstock.vn" + title.getAttribute("href")
                    : "",
                  image: image ? image.getAttribute("src") : null,
                  time: time ? time.innerText : null,
                  newsShortDescription: newsShortDescription
                    ? newsShortDescription.innerText
                    : "",
                  categoriesId: evalVar.categoriesId,
                });
              }
            }
            let button = document.evaluate(
              "//*[@id='page-next ']",
              document,
              null,
              XPathResult.FIRST_ORDERED_NODE_TYPE,
              null
            ).singleNodeValue;
            if (button) {
              button.click();
            }
            num++;
          } else {
            clearInterval(timerId);
            return __resolve(ar_title);
          }
        }, 2000);
      });
    }, evalVar)
    .then(async (result) => {
      // console.log("result1: " + JSON.stringify(result));
      console.log("result1.leng: ", result.length);
      newsCategoryUrls = newsCategoryUrls ? newsCategoryUrls : [];
      if (result.length > 0) {
        result.forEach((element) => {
          let time;
          if (element.time) {
            time = formatTime(element.time, 1);
          }
          if (checkBeforePush(checkUrlArray, "link", element, "href")) {
            if ((time && time > lastTrackTime) || !lastTrackTime || !time) {
              newsCategoryUrls.push({
                link: element.href,
                _newsPapersId: newspapersId,
                newsPapersId: newspapersId,
                lastTrackTime: time,
                item: element,
                key: key,
                categoriesId: element.categoriesId,
              });
              checkUrlArray.push({
                link: element.href,
                newsPapersId: newspapersId,
                lastTrackTime: time,
              });
            }
          }
        });
      }
    });
  // await page.screenshot({ path: screenshot })
  // await context.close()
  page.close();
};
const vietstockNewDetail = async (
  context,
  link,
  _newsPapersId,
  item,
  typeKeyWord,
  disasters,
  classifyKeyWord
) => {
  const page = await context.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  await page.goto(link, {
    waitUntil: "load",
    timeout: 0,
  });
  await page.content();

  await page.waitForTimeout(5000);

  let evalVar = {
    link,
    _newsPapersId,
    time: item.time,
    image: item.image,
    newsTitle: item.newsTitle,
    newsShortDescription: item.newsShortDescription,
    categoriesId: item.categoriesId,
  };
  console.log("evalVar", evalVar);
  await page
    .evaluate(async (evalVar) => {
      return await new Promise(async (__resolve, __reject) => {
        let o_title;
        let newsDescription1 = document.evaluate(
          "//div[@class='col-xs-12 col-lg-10 width_medium']/div",
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue;
        let newsAuthor = document.evaluate(
          "//p[@class='pAuthor']",
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue;
        o_title = {
          title: evalVar.newsTitle,
          image: evalVar.image,
          shortDescription: evalVar.newsShortDescription,
          description: newsDescription1
            ? newsDescription1.innerHTML.replace(
                /src=\"\//gims,
                'src="https://image.vietstock.vn/'
              )
            : "",
          author: newsAuthor ? newsAuthor.innerText : "",
          // newspapersId: evalVar._newsPapersId,
          source: evalVar.link,
          tag: "",
          seoKeywords: "",
          seoDescriptions: "",
          createDate: evalVar.time,
          // url: evalVar.link,
          categoriesId: evalVar.categoriesId,
        };

        return __resolve(o_title);
      });
    }, evalVar)
    .then((result) => {
      console.log("OK");
      if (result) {
        console.log("result2: " + JSON.stringify(result));
        // console.log("OK1");
        if (result.createDate && result.createDate != "") {
          result.createDate = formatTime(result.createDate, 1);
        } else {
          result.createDate = new Date();
        }
        console.log("OK2");
        if (result.image) {
          result.image = result.image.includes("http")
            ? result.image
            : "https://image.vietstock.vn" + result.image;

          // result.image = [
          //   {
          //     file: result.image,
          //     extension: result.image.split(".").pop().split("?")
          //       ? result.image.split(".").pop().split("?")[0]
          //       : "base64",
          //   },
          // ];
        }
        if (result.description && result.description != "") {
          const dom = new jsdom.JSDOM(
            `<!DOCTYPE html><body>${result.description}</body>`
          );
          const document = dom.window.document;
          const div = document.querySelectorAll("div[type='link']");
          for (let i = 0; i < div.length; i++) {
            div[i].remove();
          }
          const div2 = document.querySelectorAll("body > table");
          for (let i = 0; i < div2.length; i++) {
            div2[i].remove();
          }
          const div3 = document.querySelectorAll("p.pSource");
          for (let i = 0; i < div3.length; i++) {
            div3[i].remove();
          }
          const div4 = document.querySelectorAll("p.pAuthor");
          for (let i = 0; i < div4.length; i++) {
            div4[i].remove();
          }
          result.description = document.querySelector("body").innerHTML;
        }
        if (result.title) result.urlSlugs = urlRewrite(result.title);

        let param = {
          entity: {
            ...result,
          },
        };
        console.log("OK3");
        articleService.createOrUpdate(param);
      }
    });
  // await page.screenshot({ path: screenshot })
  //context;
  page.close();
};

module.exports = {
  vietstockCategory,
  vietstockNewDetail,
};
