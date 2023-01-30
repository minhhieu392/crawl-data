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
//pageandrelaod =1
const vietnambizCategory = async (
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

  link = link.replace("{page}", pageSize);
  console.log("link", link);
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
  await page
    .evaluate(async (evalVar) => {
      return await new Promise(async (__resolve, __reject) => {
        // console.log("strRegex==",evalVar.strRegex)
        /**/
        let ar_title = [];
        // top 1 news

        let news = document.evaluate(
          "//ul[@class='listnews']/li",
          document,
          null,
          XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
          null
        );
        // return __resolve({
        //   length: news ? news.snapshotLength : "a",
        // });
        if (news && news.snapshotLength >= 1) {
          for (let i = 0, length = news.snapshotLength; i < length; ++i) {
            let title = document.evaluate(
              "./a",
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
              let image = document.evaluate(
                "./a/img",
                news.snapshotItem(i),
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
              ).singleNodeValue;
              ar_title.push({
                href: title.getAttribute("href").includes("http")
                  ? title.getAttribute("href")
                  : "https://vietnambiz.vn" + title.getAttribute("href"),
                newsTitle: title.getAttribute("title"),
                image: image ? image.getAttribute("src") : "",
                categoriesId: evalVar.categoriesId,
              });
            }
          }
        }
        return __resolve(ar_title);
      });
    }, evalVar)
    .then(async (result) => {
      // console.log("result1: " + JSON.stringify(result));

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

const vietnambizNewDetail = async (
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
    newsTitle: item.newsTitle || null,
    newsShortDescription: item.newsShortDescription || "",
    image: item.image,
    time: item.time,
    categoriesId: item.categoriesId,
  };
  console.log("eval", evalVar);

  await page
    .evaluate(async (evalVar) => {
      return await new Promise(async (__resolve, __reject) => {
        let o_title;

        let newsDescription = document.evaluate(
          "//div[@class='vnbcbc-body vceditor-content']",
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue;
        let newsShortDescription = document.evaluate(
          "//div[@class='vnbcbc-sapo']",
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue;
        let newsAuthor = document.evaluate(
          "//p[@class='author']",
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue;
        let time = document.evaluate(
          "//span[@class='vnbcbat-data ']",
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue;

        o_title = {
          title: evalVar.newsTitle,
          image: evalVar.image,
          shortDescription: newsShortDescription
            ? newsShortDescription.innerText
            : "",
          description: newsDescription
            ? newsDescription.innerHTML
                .replace(/src=\"\//gims, 'src="https://cdn.vietnambiz.vn/')
                .replace(
                  /<div class=\"google-auto-placed ap_container\".*?<\/ins><\/div>/gims,
                  ""
                )
                .trim()
            : "",
          author: newsAuthor ? newsAuthor.innerText : "",
          source: evalVar.link,
          tag: "",
          seoKeywords: "",
          seoDescriptions: "",
          createDate: time ? time.innerText : null,
          categoriesId: evalVar.categoriesId,
        };

        return __resolve(o_title);
      });
    }, evalVar)
    .then((result) => {
      if (result) {
        // console.log("result2: " + JSON.stringify(result));
        if (result.createDate && result.createDate != "") {
          result.createDate = formatTime(result.createDate, 1);
        } else {
          result.createDate = new Date();
        }
        if (result.image) {
          result.image = result.image.includes("http")
            ? result.image
            : "https://cdn.vietnambiz.vn" + result.image;
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
          result.description = result.description.toString().trim();
          const dom = new jsdom.JSDOM(
            `<!DOCTYPE html><body>${result.description}</body>`
          );
          const document = dom.window.document;
          const div = document.querySelectorAll(
            "div.google-auto-placed.ap_container"
          );
          for (let i = 0; i < div.length; i++) {
            div[i].remove();
          }
          const div2 = document.querySelectorAll("div[type='RelatedNewsBox']");
          for (let i = 0; i < div2.length; i++) {
            div2[i].remove();
          }
          result.description = document.querySelector("body").innerHTML;
        }
        // if (result.newsSubTitle && result.newsDescription) {
        //   result.newsDescription =
        //     "<p>" + result.newsSubTitle + "</p>" + result.newsDescription;
        // }
        if (result.title) result.urlSlugs = urlRewrite(result.title);

        let param = {
          entity: {
            ...result,
          },
          typeKeyWord: typeKeyWord,
          disasters: disasters,
        };
        // console.log("result2: " + JSON.stringify(result));
        articleService.createOrUpdate(param);
      }
    });

  // await page.screenshot({
  //   path: "codesnacks.png",
  //   fullPage: true,
  // });

  //context;
  // page.close();
};

module.exports = {
  vietnambizCategory,
  vietnambizNewDetail,
};
