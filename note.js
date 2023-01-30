const puppeteer = require("puppeteer");
// import dotenv from "dotenv";
const fs = require("fs");
const muasam = (async () => {
  const browser = await puppeteer.launch({
    headless: false,
    // args: ["--disable-features=SaveLinkAs"],
    args: ["--download-dir=C:\\Users\\minhh\\OneDrive\\Desktop\\crs"],
  });

  const page = await browser.newPage();

  await page.goto(
    "https://muasamcong.mpi.gov.vn/web/guest/contractor-selection?p_p_id=egpportalcontractorselectionv2_WAR_egpportalcontractorselectionv2&p_p_lifecycle=0&p_p_state=normal&p_p_mode=view&_egpportalcontractorselectionv2_WAR_egpportalcontractorselectionv2_render=detail&type=es-notify-contractor&stepCode=notify-contractor-step-1-tbmt&id=7f890837-cb0d-4ed9-a2c5-ded661a11779&notifyId=7f890837-cb0d-4ed9-a2c5-ded661a11779&inputResultId=undefined&bidOpenId=undefined&techReqId=undefined&bidPreNotifyResultId=undefined&bidPreOpenId=undefined&processApply=LDT&bidMode=1_HTHS&notifyNo=IB2300005901&planNo=PL2300003851&pno=undefined"
  );
  const client = await page.target().createCDPSession();
  // await client.send("Page.setDownloadBehavior", {
  //   behavior: "allow",
  //   downloadPath: "C:\\Users\\minhh\\OneDrive\\Desktop\\crs",
  // });

  await new Promise((resolve) => setTimeout(resolve, 10000));

  await page.evaluate(() => {
    document.querySelector("#tenderNotice > ul > li:nth-child(2) > a").click();
  });
  await new Promise((resolve) => setTimeout(resolve, 5000));
  const pdf = await page.$$(
    "#file-tender-invitation > div > div > table > tbody > tr"
  );
  const tableData = await Promise.all(
    pdf.map(async (row) => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const cells = await row.$$("td > table > tbody > tr");
      const childRow = await Promise.all(
        cells.map(async (child) => {
          await new Promise((resolve) => setTimeout(resolve, 3000));
          console.log("c", child);
          await child.click(" td:nth-child(2) > span");
          await new Promise((resolve) => setTimeout(resolve, 3000));

          const newPage = await browser.waitForTarget(
            (target) => target.opener() === page
          );
          await new Promise((resolve) => setTimeout(resolve, 2000));

          await newPage.evaluate(() => {
            document
              .querySelector(
                "#egp_body > ebid-viewer > div.p-3.fixed-top.bg-gray-200.ng-star-inserted > div > div.text-center.pt-3 > button"
              )
              .click();
          });

          await client.send("Page.setDownloadBehavior", {
            behavior: "allow",
            downloadPath: "C:\\Users\\minhh\\OneDrive\\Desktop\\crs",
          });
          await new Promise((resolve) => setTimeout(resolve, 2000));
        })
      );
    })
  );
  // const pdf = await page.evaluate(() => {
  //   const rows = document.querySelectorAll(
  //     "#file-tender-invitation > div > div > table > tbody > tr"
  //   );
  //   rows.forEach((item) => {
  //     const childTable = item.querySelectorAll(" td > table > tbody > tr");
  //     childTable.forEach((e) => {
  //       e.querySelector(" td:nth-child(2) > span").click();
  //     });
  //   });
  // });
  // const data = await page.evaluate(() => {
  //   const rows = document.querySelectorAll(
  //     ".card-body.item-table > table > tbody > tr"
  //   );
  //   // const test = document.querySelector(
  //   //   "#tab1 > div.card.border--none.card-expand > div.card-body.item-table > table > tbody > tr > td:nth-child(2)"
  //   // ).innerText;
  //   const data = [];
  //   // data.push(test);
  //   rows.forEach((item) => {
  //     const a = {};
  //     a.name = item.querySelector("td:nth-child(2)").innerText;
  //     data.push(a);
  //   });
  //   // for (const row of rows) {
  //   //   const cells = row.querySelectorAll("td");
  //   //   data.push(cells);
  //   //   //   const [name, age, address] = cells;
  //   //   //   data.push({
  //   //   //     name: name.innerText,
  //   //   //     age: age.innerText,
  //   //   //     address: address.innerText,
  //   //   //   });
  //   // }
  //   return data;
  // });
  // console.log(data);
})();
