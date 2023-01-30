const puppeteer = require("puppeteer");
const fs = require("fs");
const { log } = console;
const { Worker } = require("worker_threads");
const async = require("async");
import dotenv from "dotenv";

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
const muasam = (async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--disable-features=SaveLinkAs"],
  });

  const page = await browser.newPage();

  await page.goto(
    "https://muasamcong.mpi.gov.vn/web/guest/contractor-selection?render=search"
  );
  const client = await page.target().createCDPSession();
  let fileName;
  // Nhap ten goi thau
  await page.$eval(
    "#search-advantage-haunt > div > div > div > div.content__body > div:nth-child(2) > div.content__body__session__desc > input",
    (el) => (el.value = "")
  );
  // Thời gian bắt đầu (1)
  await page.$eval(
    "#search-advantage-haunt > div > div > div > div.content__body > div:nth-child(3) > div.content__body__session__desc > div > div:nth-child(1) > span > div > input",
    (el) => (el.value = "")
  );
  // Thời gian bắt đầu (2)
  await page.$eval(
    "#search-advantage-haunt > div > div > div > div.content__body > div:nth-child(3) > div.content__body__session__desc > div > div:nth-child(3) > span > div > input",
    (el) => (el.value = "")
  );
  // Chủ đầu tư
  await page.$eval(
    "#search-advantage-haunt > div > div > div > div.content__body > div:nth-child(6) > div.content__body__session__desc > input",
    (el) => (el.value = "")
  );
  // Bên mời thầu
  await page.$eval(
    "#search-advantage-haunt > div > div > div > div.content__body > div:nth-child(7) > div.content__body__session__desc > input",
    (el) => (el.value = "")
  );
  // Giá gói thầu ( từ )
  await page.$eval(
    "#search-advantage-haunt > div > div > div > div.content__body > div:nth-child(11) > div.content__body__session__desc > div > div:nth-child(1) > input",
    (el) => (el.value = "")
  );
  // Giá gói thầu ( đến )
  await page.$eval(
    "#search-advantage-haunt > div > div > div > div.content__body > div:nth-child(11) > div.content__body__session__desc > div > div:nth-child(3) > input",
    (el) => (el.value = "")
  );
  // Thời gian đóng (1)
  await page.$eval(
    "#search-advantage-haunt > div > div > div > div.content__body > div:nth-child(4) > div.content__body__session__desc > div > div:nth-child(1) > span > div > input",
    (el) => (el.value = "")
  );
  // Thời gian đóng (2)
  await page.$eval(
    "#search-advantage-haunt > div > div > div > div.content__body > div:nth-child(4) > div.content__body__session__desc > div > div:nth-child(3) > span > div > input",
    (el) => (el.value = "")
  );
  // Quy trình áp dụng
  await page.select(
    "#search-advantage-haunt > div > div > div > div.content__body > div:nth-child(12) > div.content__body__session__desc > div > select",
    ""
  );
  // search
  await page.$eval(
    "#search-advantage-haunt > div > div > div > div.content__footer > button:nth-child(2)",
    (form) => form.click()
  );
  await timeout(5000);
  // page number
  const pages =
    (await page.$$eval(
      "#search-home > div.content__wrapper.background--white > div:nth-child(2) > div > div > ul > .number",
      (els) => els.map((e) => Number(e.textContent))
    )) ||
    (await page.$$eval(
      "#search-home > div.content__wrapper.background--white > div:nth-child(2) > div > div > ul > .number.active",
      (els) => els.map((e) => Number(e.textContent))
    ));

  const numPages = Math.max.apply(Math, pages);
  const kq = [];
  const kq1 = [];
  const tasks = [];
  const links = [];
  for (let i = 1; i <= 1; i++) {
    // Lấy dữ liệu từ trang hiện tại
    const data = await page.evaluate(() => {
      // Code lấy dữ liệu từ trang web
      const dataArray = [];
      const linkArray = [];
      const divElements =
        document.querySelectorAll(".content__body__left__item") || 0;
      if (divElements === 0) return dataArray;

      divElements.forEach((content) => {
        try {
          let links;
          let dataJson = {};
          dataJson.title =
            content.querySelector(
              ".content__body__left__item__infor__contract__name.format__text__title"
            ) &&
            content.querySelector(
              ".content__body__left__item__infor__contract__name.format__text__title"
            ).innerText;

          dataJson.code = content.querySelector(
            ".content__body__left__item__infor__code"
          ).innerText;
          dataJson.benmoithau = content.querySelector(
            ".col-md-8.content__body__left__item__infor__contract__other.format__text > .format__text > span"
          ).innerText;

          dataJson.linhvuc = content.querySelector(
            ".col-md-4.content__body__left__item__infor__contract__other >  h6:nth-child(1) > span"
          ).innerText;
          dataJson.diadiem = content.querySelector(
            ".col-md-4.content__body__left__item__infor__contract__other >  h6.format__text__title > span"
          ).innerText;
          dataJson.endDate =
            content.querySelector(
              ".col-md-2.content__body__right__item__infor__contract > div > h5:nth-child(2)"
            ).innerText +
            " " +
            content.querySelector(
              ".col-md-2.content__body__right__item__infor__contract > div > h5:nth-child(3)"
            ).innerText;
          dataJson.hinhthuc = content.querySelector(
            ".col-md-2.content__body__right__item__infor__contract > div > h5:nth-child(5)"
          ).innerText;
          dataJson.status = content.querySelector(
            ".content__body__left__item__infor__notice--be"
          ).innerText;
          links = content.querySelector(
            ".content__body__left__item__infor__contract > a"
          ).href;
          linkArray.push(links);
          dataArray.push(dataJson);
        } catch (err) {
          console.log(err);
        }
      });
      return { dataArray, linkArray };
    });
    // Lưu dữ liệu vào mảng
    kq.push(...data.dataArray);
    links.push(...data.linkArray);

    // tasks.push((callback) => {
    //   const worker = new Worker("./src/workers/muasam.worker.js");
    //   worker.postMessage(data.linkArray);
    //   worker.on("message", (message) => {

    //     callback(null, message);
    //   });
    //   worker.on("error", (error) => {
    //     callback(error);
    //   });
    //   worker.on("exit", (code) => {
    //     if (code !== 0)
    //       callback(new Error(`Worker stopped with exit code ${code}`));
    //   });
    // });

    // Click vào nút chuyển trang
    if (i < numPages) {
      let nextButton = await page.$(
        "#search-home > div.content__wrapper.background--white > div:nth-child(1) > div.content__body__left > div:nth-child(1) > div > div > div > button.btn-next"
      );
      if (nextButton) {
        await nextButton.click();

        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  }
  fs.writeFileSync("data.json", JSON.stringify(kq));

  const promises = [];
  const limit = process.env.LIMIT_TAB;
  const downloadPath = process.env.DOWNLOAD_PATH;
  let mid;
  for (let i = 0; i < links.length; i += limit) {
    const group = links.slice(i, i + limit);
    promises.push(
      Promise.all(
        group.map(async (link) => {
          const newPage = await browser.newPage();
          await newPage.goto(link);

          await page.waitForTimeout(15000);
          // lấy dữ liệu từ trang
          const data = await newPage.evaluate(() => {
            const jsonLinks = {};
            jsonLinks.ma_TBMT =
              document.querySelector(
                "#info-general > div:nth-child(2) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(1) > div:nth-child(2)"
              ).innerText || "";
            jsonLinks.ngay_dang_tai =
              document.querySelector(
                "#info-general > div:nth-child(2) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(2) > div:nth-child(2)"
              ).innerText || "";
            jsonLinks.ma_KHLCNT =
              document.querySelector(
                "#info-general > div:nth-child(3) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(1) > div.text-blue-4D7AE6"
              ).innerText || "";
            jsonLinks.phan_loai_KHLCNT =
              document.querySelector(
                "#info-general > div:nth-child(3) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(2) > div:nth-child(2)"
              ).innerText || "";
            document.querySelector(
              "#info-general > div:nth-child(3) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(3) > div:nth-child(2)"
            )
              ? (jsonLinks.ten_du_an_mua_sam = document.querySelector(
                  "#info-general > div:nth-child(3) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(3) > div:nth-child(2)"
                ).innerText)
              : (jsonLinks.ten_du_an_mua_sam = "");

            jsonLinks.ten_goi_thau =
              document.querySelector(
                "#info-general > div:nth-child(4) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(1) > div:nth-child(2)"
              ).innerText || "";

            if (
              document.querySelector(
                "#info-general > div:nth-child(4) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(10) > div:nth-child(2)"
              )
            ) {
              jsonLinks.chu_dau_tu =
                document.querySelector(
                  "#info-general > div:nth-child(4) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(2) > div:nth-child(2)"
                ).innerText || "";
              jsonLinks.ben_moi_thau =
                document.querySelector(
                  "#info-general > div:nth-child(4) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(3) > div:nth-child(2)"
                ).innerText || "";
              jsonLinks.nguon_von =
                document.querySelector(
                  "#info-general > div:nth-child(4) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(4) > div:nth-child(2)"
                ).innerText || "";
              jsonLinks.linh_vuc =
                document.querySelector(
                  "#info-general > div:nth-child(4) > div.card-body.d-flex.flex-column.align-items-start.infomation > div.d-flex.flex-row.align-items-start.infomation__content.w-100 > div.infomation__content__title"
                ).innerText || "";
              jsonLinks.hinh_thuc_lua_chon_nha_thau =
                document.querySelector(
                  "#info-general > div:nth-child(4) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(6) > div:nth-child(2)"
                ).innerText || "";
              jsonLinks.loai_hop_dong =
                document.querySelector(
                  "#info-general > div:nth-child(4) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(7) > div:nth-child(2)"
                ).innerText || "";
              jsonLinks.trongnuoc_quocte =
                document.querySelector(
                  "#info-general > div:nth-child(4) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(8) > div:nth-child(2)"
                ).innerText || "";
              jsonLinks.phuong_thuc_lua_chon_nha_thau =
                document.querySelector(
                  "#info-general > div:nth-child(4) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(9) > div:nth-child(2)"
                ).innerText || "";
              jsonLinks.thoi_gian_thuc_hien_hop_dong =
                document.querySelector(
                  "#info-general > div:nth-child(4) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(10) > div:nth-child(2)"
                ).innerText || "";
            } else {
              jsonLinks.chu_dau_tu = "";
              jsonLinks.ben_moi_thau =
                document.querySelector(
                  "#info-general > div:nth-child(4) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(2) > div:nth-child(2)"
                ).innerText || "";
              jsonLinks.nguon_von =
                document.querySelector(
                  "#info-general > div:nth-child(4) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(3) > div:nth-child(2)"
                ).innerText || "";
              jsonLinks.linh_vuc =
                document.querySelector(
                  "#info-general > div:nth-child(4) > div.card-body.d-flex.flex-column.align-items-start.infomation > div.d-flex.flex-row.align-items-start.infomation__content.w-100 > div:nth-child(2)"
                ).innerText || "";
              jsonLinks.hinh_thuc_lua_chon_nha_thau =
                document.querySelector(
                  "#info-general > div:nth-child(4) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(5) > div:nth-child(2)"
                ).innerText || "";
              jsonLinks.loai_hop_dong =
                document.querySelector(
                  "#info-general > div:nth-child(4) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(6) > div:nth-child(2)"
                ).innerText || "";
              jsonLinks.trongnuoc_quocte =
                document.querySelector(
                  "#info-general > div:nth-child(4) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(7) > div:nth-child(2)"
                ).innerText || "";
              jsonLinks.phuong_thuc_lua_chon_nha_thau =
                document.querySelector(
                  "#info-general > div:nth-child(4) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(8) > div:nth-child(2)"
                ).innerText || "";
              jsonLinks.thoi_gian_thuc_hien_hop_dong =
                document.querySelector(
                  "#info-general > div:nth-child(4) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(9) > div:nth-child(2)"
                ).innerText || "";
            }

            jsonLinks.dia_diem_phat_hanh_hsmt =
              document.querySelector(
                "#info-general > div:nth-child(5) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(2) > div:nth-child(2)"
              ).innerText || "";
            jsonLinks.gia_ban_hsmt =
              document.querySelector(
                "#info-general > div:nth-child(5) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(3) > div:nth-child(2)"
              ).innerText || "";
            jsonLinks.dia_diem_nhan_HSDT =
              document.querySelector(
                "#info-general > div:nth-child(5) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(4) > div:nth-child(2)"
              ).innerText || "";
            jsonLinks.dia_diem_thuc_hien =
              document.querySelector(
                "#info-general > div:nth-child(5) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(5) > div:nth-child(2) > p"
              ).innerText || "";
            jsonLinks.thoi_diem_dong_thau =
              document.querySelector(
                "#info-general > div:nth-child(6) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(1) > div:nth-child(2)"
              ).innerText || "";
            jsonLinks.thoi_diem_mo_thau =
              document.querySelector(
                "#info-general > div:nth-child(6) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(2) > div:nth-child(2)"
              ).innerText || "";
            jsonLinks.dia_diem_mo_thau =
              document.querySelector(
                "#info-general > div:nth-child(6) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(3) > div:nth-child(2)"
              ).innerText || "";
            jsonLinks.hieu_luc_ho_so =
              document.querySelector(
                "#info-general > div:nth-child(6) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(4) > div:nth-child(2)"
              ).innerText || "";

            document.querySelector(
              "#info-general > div:nth-child(6) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(5) > div:nth-child(2)"
            )
              ? (jsonLinks.tien_dam_bao = document.querySelector(
                  "#info-general > div:nth-child(6) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(5) > div:nth-child(2)"
                ).innerText)
              : (jsonLinks.tien_dam_bao = "");
            document.querySelector(
              "#info-general > div:nth-child(6) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(6) > div:nth-child(2)"
            )
              ? (jsonLinks.hinh_thuc_dam_bao = document.querySelector(
                  "#info-general > div:nth-child(6) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(6) > div:nth-child(2)"
                ).innerText)
              : (jsonLinks.hinh_thuc_dam_bao = "");
            jsonLinks.so_quuet_dinh_phe_duyet =
              document.querySelector(
                "#info-general > div:nth-child(7) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(1) > div:nth-child(2)"
              ).innerText || "";
            jsonLinks.ngay_phe_duyet =
              document.querySelector(
                "#info-general > div:nth-child(7) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(2) > div:nth-child(2)"
              ).innerText || "";
            jsonLinks.co_quan_ban_hanh_quyet_dinh =
              document.querySelector(
                "#info-general > div:nth-child(7) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(3) > div:nth-child(2)"
              ).innerText || "";
            // chuyen trang
            // document
            //   .querySelector(
            //     "#info-general > div:nth-child(3) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(1) > div.text-blue-4D7AE6"
            //   )
            //   .click();
            return jsonLinks;
          });
          await newPage.evaluate(() => {
            document.querySelector("#info-general > div.mb-2 > span").click();
          });

          fileName = `${data.ma_TBMT}`;
          await client.send("Page.setDownloadBehavior", {
            behavior: "allow",
            downloadPath:
              "C:\\Users\\minhh\\OneDrive\\Desktop\\doc-bao\\pdf\\" + fileName,
          });
          await new Promise((resolve) => setTimeout(resolve, 3000));

          await newPage.evaluate(() => {
            document
              .querySelector("#tenderNotice > ul > li:nth-child(2) > a")
              .click();
          });
          await new Promise((resolve) => setTimeout(resolve, 3000));
          // const pdf = await newPage.$$(
          //   "#file-tender-invitation > div > div > table > tbody > tr"
          // );
          // const tableData = await Promise.all(
          //   pdf.map(async (row) => {
          //     await new Promise((resolve) => setTimeout(resolve, 2000));
          //     const cells = await row.$$("td > table > tbody > tr");
          //     const childRow = await Promise.all(
          //       cells.map(async (child) => {
          //         await new Promise((resolve) => setTimeout(resolve, 2000));
          //         // console.log("c", child);

          //         // const text = await newPage.evaluate(() => {
          //         //   child.querySelector("td:nth-child(2) > span").innerText;
          //         // });
          //         console.log("c", child);
          //         const text = await newPage.evaluate(
          //           (child) =>
          //             child.querySelector("td:nth-child(2) > span").innerText
          //         );

          //         console.log("d", text);
          //         await new Promise((resolve) => setTimeout(resolve, 2000));
          //       })
          //     );
          //   })
          // );
          await newPage.evaluate(() => {
            document
              .querySelector(
                "#file-tender-invitation > div > div > table > thead > tr > th:nth-child(2) > span:nth-child(2) > span"
              )
              .click();
          });
          // await new Promise((resolve) => setTimeout(resolve, 2000));

          const pagedirex = await browser.waitForTarget(
            (target) => target.opener() === newPage
          );

          // await new Promise((resolve) => setTimeout(resolve, 1000));
          const currentUrl = pagedirex.url();
          console.log("u", currentUrl);
          await newPage.evaluate(() => {
            document
              .querySelector(
                "#info-general > div:nth-child(3) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(1) > div.text-blue-4D7AE6"
              )
              .click();
          });

          await new Promise((resolve) => setTimeout(resolve, 10000));

          // await page.waitForSelector("tbody", { visible: true });
          const infor = await newPage.evaluate(() => {
            // Lấy dữ liệu từ trang mới
            const rows = document.querySelectorAll(
              ".card-body.item-table > table > tbody > tr"
            );
            const infor = [];

            for (const row of rows) {
              const cells = row.querySelectorAll("td");
              const [ten_goi_thau, linh_vuc, gia_goi_thau, nguon_von] = cells;
              infor.push({
                ten_goi_thau: ten_goi_thau.innerText,
                linh_vuc: linh_vuc.innerText,
                gia_goi_thau: gia_goi_thau.innerText,
                nguon_von: nguon_von.innerText,
              });
            }
            return infor;
          });
          mid = infor.length / 2;

          data.infor = infor.splice(0, mid);
          // await newPage.close();
          return data;
        })
      )
    );
    await new Promise((resolve) => setTimeout(resolve, 35000));
  }

  const data = await Promise.all(promises);
  fs.writeFileSync("links.json", JSON.stringify(data));

  // console.log(data);
  // async.parallelLimit(tasks, 1, (err, results) => {
  //   if (err) {
  //     console.error(err);
  //   } else {
  //     console.log(results);
  //   }
  // });

  // await browser.close();
})();
module.exports = {
  muasam,
};
