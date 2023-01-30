const puppeteer = require("puppeteer");
const fs = require("fs");
const { parentPort } = require("worker_threads");

const handlePage = async (array) => {
  const browser = await puppeteer.launch({ headless: false });
  let promises = array.map(async (link) => {
    // console.log("link", link);
    let page = await browser.newPage();
    await page.goto(link);

    let data = await page.evaluate(() => {
      return document.querySelector(
        "#info-general > div:nth-child(2) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(1) > div:nth-child(2)"
      ).innerText;
    });
    await page.close();
    console.log("k", data);
    return data;
  });
  let result = await Promise.all(promises);
  return result;
};

parentPort.on("message", (workerData) => {
  let arr = workerData;
  // console.log("okokokokokokokokko");
  const result = handlePage(arr);
  console.log("r", result);

  // parentPort.postMessage(result);
});
// fs.writeFileSync("test01.json", JSON.stringify(result));
