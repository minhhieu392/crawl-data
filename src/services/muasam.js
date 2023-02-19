const puppeteer = require("puppeteer");
import models from "../entity/index";
const fs = require("fs");
const { log } = console;
const { Worker } = require("worker_threads");
const async = require("async");
import dotenv from "dotenv";
import MODELS from "../models/models";
import moment from "moment";
const { bids, projects, biddingPartys, fields } = models;
function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
const dataArray = [];

export default muasam = (async () => {
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
  await timeout(4000);
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
  const files = [];
  for (let i = 1; i <= 2; i++) {
    // Lấy dữ liệu từ trang hiện tại
    const data = await page.evaluate(() => {
      // Code lấy dữ liệu từ trang web
      const dataArray = [];
      const linkArray = [];
      const fileArray = [];
      const divElements =
        document.querySelectorAll(".content__body__left__item") || 0;
      if (divElements === 0) return dataArray;

      divElements.forEach((content) => {
        try {
          let file;
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
          const id_ho_so = links.match(/&id=([a-z0-9-]+)/)[1];
          file = `https://muasamcong.mpi.gov.vn/egp/contractorfe/viewer?formCode=ALL&id=${id_ho_so}&fileName=H%E1%BB%93%20s%C6%A1%20m%E1%BB%9Di%20th%E1%BA%A7u`;
          fileArray.push(file);
          linkArray.push(links);
          dataArray.push(dataJson);
        } catch (err) {
          console.log(err);
        }
      });
      return { dataArray, linkArray, fileArray };
    });
    // Lưu dữ liệu vào mảng
    kq.push(...data.dataArray);
    links.push(...data.linkArray);
    // fields.push(...data.fileArray);

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
  // await page.close();

  const promises = [];
  const limit = process.env.LIMIT_TAB;
  const downloadPath = process.env.DOWNLOAD_PATH;
  let mid;

  for (let i = 0; i < links.length; i += 5) {
    const group = links.slice(i, i + 5);
    promises.push(
      Promise.all(
        group.map(async (link) => {
          const ho_so = link.match(/&id=([a-z0-9-]+)/)[1];
          const urlDownload = `https://muasamcong.mpi.gov.vn/egp/contractorfe/viewer?formCode=ALL&id=${ho_so}&fileName=H%E1%BB%93%20s%C6%A1%20m%E1%BB%9Di%20th%E1%BA%A7u`;
          const newPage = await browser.newPage();
          await newPage.goto(link);

          await page.waitForTimeout(10000);
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

              //trong nước - quốc tế

              document.querySelector(
                "#info-general > div:nth-child(4) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(8) > div:nth-child(2)"
              ).innerText === "Trong nước"
                ? (jsonLinks.trongnuoc_quocte = 1)
                : (jsonLinks.trongnuoc_quocte = 0);

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
              document.querySelector(
                "#info-general > div:nth-child(4) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(8) > div:nth-child(2)"
              ).innerText === "Trong nước"
                ? (jsonLinks.trongnuoc_quocte = 1)
                : (jsonLinks.trongnuoc_quocte = 0);
              jsonLinks.phuong_thuc_lua_chon_nha_thau =
                document.querySelector(
                  "#info-general > div:nth-child(4) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(8) > div:nth-child(2)"
                ).innerText || "";
              jsonLinks.thoi_gian_thuc_hien_hop_dong =
                document.querySelector(
                  "#info-general > div:nth-child(4) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(9) > div:nth-child(2)"
                ).innerText || "";
            }

            // hình thức đấu thầu
            document.querySelector(
              "#info-general > div:nth-child(5) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(1) > div:nth-child(2) > span"
            ).innerText === "Qua mạng"
              ? (jsonLinks.hinh_thuc_dau_thau = 0)
              : (jsonLinks.hinh_thuc_dau_thau = 1);

            jsonLinks.dia_diem_phat_hanh_hsmt =
              document.querySelector(
                "#info-general > div:nth-child(5) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(2) > div:nth-child(2)"
              ).innerText || "";

            //chi phí nộp hồ sơ
            const gb_hsmt = document.querySelector(
              "#info-general > div:nth-child(5) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(3) > div:nth-child(2)"
            ).innerText;
            jsonLinks.gia_ban_hsmt = parseFloat(
              gb_hsmt.replace(/,/g, "").replace(" VND", "")
            );

            jsonLinks.dia_diem_nhan_HSDT =
              document.querySelector(
                "#info-general > div:nth-child(5) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(4) > div:nth-child(2)"
              ).innerText || "";
            jsonLinks.dia_diem_thuc_hien =
              document.querySelector(
                "#info-general > div:nth-child(5) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(5) > div:nth-child(2) > p"
              ).innerText || "";

            jsonLinks.thoi_diem_dong_thau = document.querySelector(
              "#info-general > div:nth-child(6) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(1) > div:nth-child(2)"
            ).innerText;

            // const tdmt =;
            jsonLinks.thoi_diem_mo_thau = document.querySelector(
              "#info-general > div:nth-child(6) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(2) > div:nth-child(2)"
            ).innerText;
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

            //ngày phê duyệt
            jsonLinks.ngay_phe_duyet = document.querySelector(
              "#info-general > div:nth-child(7) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(2) > div:nth-child(2)"
            ).innerText;

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

          data.ngay_phe_duyet = moment(data.ngay_phe_duyet, "DD/MM/YYYY");
          data.thoi_diem_dong_thau = moment(
            data.thoi_diem_dong_thau,
            "DD/MM/YYYY"
          );
          data.thoi_diem_mo_thau = moment(data.thoi_diem_mo_thau, "DD/MM/YYYY");

          //1--
          if (data.chu_dau_tu === "") {
            data.chu_dau_tu = 0;
          } else {
            const checkInvestorsId = await MODELS.findOne(biddingPartys, {
              where: {
                biddingPartysName: data.chu_dau_tu,
              },
            }).catch((err) => {
              console.log("err", err);
            });
            if (checkInvestorsId) {
              data.chu_dau_tu = Number(checkInvestorsId.id);
            } else {
              const createInvestorsId = await MODELS.create(biddingPartys, {
                biddingPartysName: data.chu_dau_tu,
              }).catch((err) => {
                console.log(err);
              });
              data.chu_dau_tu = Number(createInvestorsId.id);
            }
          }

          // if (data.linh_vuc === "") {
          //   data.linh_vuc = 0;
          // } else {
          //   const checkFields = await MODELS.findOne(fields, {
          //     where: {
          //       fieldsName: data.linh_vuc,
          //       status: 1,
          //     },
          //   }).catch((err) => {
          //     console.log(err);
          //   });
          //   if (checkFields) {
          //     data.linh_vuc = Number(checkFields.id);
          //   } else {
          //     const createFields = await MODELS.create(fields, {
          //       fieldsName: data.linh_vuc,
          //       status: 1,
          //     }).catch((err) => {
          //       console.log(err);
          //     });
          //     data.linh_vuc = Number(createFields.id);
          //   }
          // }
          // if (data.ben_moi_thau) {
          //   const checkBiddingPartysId = await MODELS.findOne(biddingPartys, {
          //     where: { biddingPartysName: data.ben_moi_thau },
          //   }).catch((err) => {
          //     console.log(err);
          //   });
          //   if (checkBiddingPartysId) {
          //     data.ben_moi_thau = Number(checkBiddingPartysId.id);
          //   } else {
          //     const createBiddingPartysId = await MODELS.create(biddingPartys, {
          //       biddingPartysName: data.ben_moi_thau,
          //     }).catch((err) => {
          //       console.log(err);
          //     });
          //     if (createBiddingPartysId)
          //       data.ben_moi_thau = createBiddingPartysId.id;
          //   }
          // }
          await newPage.evaluate(() => {
            document.querySelector("#info-general > div.mb-2 > span").click();
          });

          fileName = `${data.ma_TBMT}`;
          await client.send("Page.setDownloadBehavior", {
            behavior: "allow",
            downloadPath:
              "C:\\Users\\minhh\\OneDrive\\Desktop\\doc-bao\\pdf\\" + fileName,
          });
          await new Promise((resolve) => setTimeout(resolve, 2000));

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
            const gia_goi_thau = document.querySelector(
              "#tab1 > div:nth-child(2) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(1) > div:nth-child(2) > span"
            ).innerText;
            infor.push({
              money: parseFloat(
                gia_goi_thau.replace(/[^\d.-]/g, "").replace(/\./g, "")
              ),
              moneyString: document.querySelector(
                "#tab1 > div:nth-child(2) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(2) > div:nth-child(2)"
              ).innerText,
            });
            for (const row of rows) {
              const cells = row.querySelectorAll("td");
              const [stt, ten_goi_thau, linh_vuc, gia_goi_thau, nguon_von] =
                cells;
              infor.push({
                stt: stt.innerText,
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

          // await MODELS.create(bids, {
          //   tbmtCode: data.ma_TBMT,
          //   bidsName: data.ten_goi_thau,
          //   biddingPartysId: data.ben_moi_thau,
          //   investorsId: data.chu_dau_tu,
          //   capital: data.nguon_von,
          //   fieldsId: data.linh_vuc,
          //   contractorSelectionType: data.hinh_thuc_lua_chon_nha_thau,
          //   contractorSelectionMethod: data.phuong_thuc_lua_chon_nha_thau,
          //   contractType: data.loai_hop_dong,
          //   isDomestic: data.trongnuoc_quocte,
          //   contractDuration: data.thoi_gian_thuc_hien_hop_dong,
          //   biddingForm: data.hinh_thuc_dau_thau,
          //   locationRelease: data.dia_diem_phat_hanh_hsmt,
          //   locationPickUp: data.dia_diem_nhan_HSDT,
          //   expense: data.gia_ban_hsmt,
          //   locationOpening: data.dia_diem_mo_thau,
          //   startDate: data.thoi_diem_mo_thau,
          //   endDate: data.thoi_diem_dong_thau,
          //   bidValidity: data.hieu_luc_ho_so,
          //   approvalDecisionsNumber: data.so_quuet_dinh_phe_duyet,
          //   approvalDecisionsDate: data.ngay_phe_duyet,
          //   approvalDecisionsAgencies: data.co_quan_ban_hanh_quyet_dinh,
          //   bidGuarantee: data.hinh_thuc_dam_bao,
          //   projectsId: 0,
          //   url: link,
          //   downloadUrl: urlDownload,
          //   // money: data.infor[0].money,
          //   money: 0
          // }).catch((err) => {
          //   console.log("err", err);
          // });
          await new Promise((resolve) => setTimeout(resolve, 10000));

          await newPage.close();

          return data;
        })
      )
    );
    await new Promise((resolve) => setTimeout(resolve, 30000));
  }
  // console.log(promises);
  const data = await Promise.all(promises);
  fs.writeFileSync("links.json", JSON.stringify(data));

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
