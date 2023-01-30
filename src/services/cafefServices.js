import puppeteer, { launch } from "puppeteer";
const configs = require("../configs");
import fs from "fs";
import path from "path";
import _ from "lodash";
import formatTime from "../utils/formatTime";
import articleService from "./db/articleService";
import urlRewrite from "../utils/urlRewire";
import jsdom from "jsdom";
import checkBeforePush from "../utils/checkBeforePush";
//buton paginationAndreload ==0

const cafefCategory = async (
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
        let timerId = setInterval(() => {
          let scrollHeight = document.documentElement.scrollHeight;
          scrollHeight = scrollHeight + 500;
          window.scrollBy(0, scrollHeight);
          if (Number(num) < Number(evalVar.pageSize)) {
            num++;
          } else {
            clearInterval(timerId);
            let ar_title = [];
            let news = document.evaluate(
              "//*[@class='clearfix']/li",
              //*[@id="LoadListNewsCat"]/li[1]
              document,
              null,
              XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
              null
            );
            //*[@id="searchResult"]/ul/li[1]
            //*[@id="searchResult"]/ul/li[2]
            for (let i = 0, length = news.snapshotLength; i < length; ++i) {
              let title = document.evaluate(
                "./div/h3/a",
                news.snapshotItem(i),
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
              ).singleNodeValue;
              if (
                title &&
                title
                  .getAttribute("title")
                  .trim()
                  .toUpperCase()
                  .match("/" + evalVar.strRegex + "/")
              ) {
                let newsShortDescription = document.evaluate(
                  "./div/p",
                  news.snapshotItem(i),
                  null,
                  XPathResult.FIRST_ORDERED_NODE_TYPE,
                  null
                ).singleNodeValue;

                let image = document.evaluate(
                  "./a/img",
                  news.snapshotItem(i),
                  null,
                  XPathResult.FIRST_ORDERED_NODE_TYPE,
                  null
                ).singleNodeValue;

                ar_title.push({
                  newsTitle: title ? title.getAttribute("title") : "",
                  href: title
                    ? title.getAttribute("href").includes("http")
                      ? title.getAttribute("href")
                      : "https://cafef.vn" + title.getAttribute("href")
                    : "",
                  image: image ? image.getAttribute("src") : "",
                  newsShortDescription: newsShortDescription
                    ? newsShortDescription.innerText
                    : "",
                  categoriesId: evalVar.categoriesId,
                });
              }
            }
            let news2 = document.evaluate(
              "//*[@id='LoadListNewsCat']/li",
              //*[@id="LoadListNewsCat"]/li[1]
              document,
              null,
              XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
              null
            );

            for (let i = 0, length = news2.snapshotLength; i < length; ++i) {
              let title = document.evaluate(
                "./h3/a",
                news2.snapshotItem(i),
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
              ).singleNodeValue;
              if (
                title &&
                title
                  .getAttribute("title")
                  .trim()
                  .toUpperCase()
                  .match("/" + evalVar.strRegex + "/")
              ) {
                let newsShortDescription = document.evaluate(
                  "./div/p[2]",
                  news2.snapshotItem(i),
                  null,
                  XPathResult.FIRST_ORDERED_NODE_TYPE,
                  null
                ).singleNodeValue;

                let image = document.evaluate(
                  "./a/img",
                  news2.snapshotItem(i),
                  null,
                  XPathResult.FIRST_ORDERED_NODE_TYPE,
                  null
                ).singleNodeValue;
                let time = document.evaluate(
                  "./div/p[1]/span",
                  news2.snapshotItem(i),
                  null,
                  XPathResult.FIRST_ORDERED_NODE_TYPE,
                  null
                ).singleNodeValue;
                ar_title.push({
                  newsTitle: title ? title.getAttribute("title") : "",
                  href: title
                    ? title.getAttribute("href").includes("http")
                      ? title.getAttribute("href")
                      : "https://cafef.vn" + title.getAttribute("href")
                    : "",
                  image: image ? image.getAttribute("src") : "",
                  time: time ? time.getAttribute("title") : null,
                  newsShortDescription: newsShortDescription
                    ? newsShortDescription.innerText
                    : "",
                  categoriesId: evalVar.categoriesId,
                });
              }
            }

            return __resolve(ar_title);
          }
        }, 500);
      });
    }, evalVar)
    .then(async (result) => {
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
const cafefNewDetail = async (
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
        let o_title, video;
        let newsDescription1 = document.evaluate(
          "//*[@id='mainContent']",
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue;
        if (newsDescription1) {
          newsAuthor = document.evaluate(
            "//p[@class='author']",
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
                  'src="https://cafef.vn/'
                )
              : "",
            author: newsAuthor ? newsAuthor.innerText : "",
            newspapersId: evalVar._newsPapersId,
            source: evalVar.link,
            tag: "",
            seoKeywords: "",
            seoDescriptions: "",
            createDate: evalVar.time,
            categoriesId: evalVar.categoriesId,
          };

          return __resolve(o_title);
        }
        let newsDescription2 = document.evaluate(
          "//*[@class='contentdetails_left fl']",
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue;
        if (newsDescription2) {
          o_title = {
            title: evalVar.newsTitle,
            image: evalVar.image,
            shortDescription: evalVar.newsShortDescription,
            description: newsDescription2
              ? newsDescription2.innerHTML.replace(
                  /src=\"\//gims,
                  'src="https://cafef.vn/'
                )
              : "",
            author: "",
            newspapersId: evalVar._newsPapersId,
            source: evalVar.link,
            tag: "",
            seoKeywords: "",
            seoDescriptions: "",
            createDate: evalVar.time,
            categoriesId: evalVar.categoriesId,
          };

          return __resolve(o_title);
        }
        return __resolve();
      });
    }, evalVar)
    .then((result) => {
      if (result) {
        if (result.createDate && result.createDate != "") {
          result.createDate = formatTime(result.createDate, 1);
        } else {
          result.createDate = new Date();
        }
        if (result.image) {
          result.image = result.image.includes("http")
            ? result.image
            : "https://cafef.vn" + result.image;

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
          result.description = document.querySelector("body").innerHTML;
        }
        if (result.title) result.urlSlugs = urlRewrite(result.title);

        let param = {
          entity: {
            ...result,
          },
        };
        // console.log("result2: " + JSON.stringify(result));
        articleService.createOrUpdate(param);
      }
    });
  // await page.screenshot({ path: screenshot })
  //context;
  page.close();
};

module.exports = {
  cafefCategory,
  cafefNewDetail,
};
