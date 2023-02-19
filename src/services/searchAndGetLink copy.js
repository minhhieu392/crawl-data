import _ from "lodash";
import models from "../entity/index";
import MODELS from "../models/models";
import { sequelize } from "../db/sequelize";
import moment from "moment";
const logEvents = require("../utils/logEvents");

const { searchTerms } = models;

//scroll paginationAndreload ==0

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const searchAndGetLink = async (page, optionSearch = {}, linkArray) => {
  await page.goto(
    "https://muasamcong.mpi.gov.vn/web/guest/contractor-selection?render=search"
  );
  // const client = await page.target().createCDPSession();

  const {
    id,
    search,
    postingTimeStart,
    postingTimeEnd,
    bidCloseDateStart,
    bidCloseDateEnd,
    investorsSearch,
    biddingPartysSearch,
    fieldsId,
    moneyFrom,
    moneyTo,
    isDomestic,
    biddingForm,
    districtsName,
    provincesName,
    applyProcess,
  } = optionSearch;

  console.log("search", optionSearch);
  // Nhap ten goi thau

  await new Promise((resolve) => setTimeout(resolve, 4000));
  await page
    .type(
      "#search-advantage-haunt > div > div > div > div.content__body > div:nth-child(2) > div.content__body__session__desc > input",
      search || ""
    )
    .catch((e) => {
      let error = new Error(e);
      logEvents(`searchAndGetLink---${id}---${error.message}`);
    });
  // await page.$eval(
  //   "#search-advantage-haunt > div > div > div > div.content__body > div:nth-child(2) > div.content__body__session__desc > input",
  //   (el, ) => (el.value = "IB2300012722")
  // );
  if (
    postingTimeStart ||
    postingTimeEnd ||
    bidCloseDateStart ||
    bidCloseDateEnd
  ) {
    // Thời gian bắt đầu (1)
    await page
      .$eval(
        "#search-advantage-haunt > div > div > div > div.content__body > div:nth-child(3) > div.content__body__session__desc > div > div:nth-child(1) > span > div > input",
        (form) => form.click()
      )
      .catch((e) => {
        let error = new Error(e);
        logEvents(`searchAndGetLink---${id}---${error.message}`);
      });

    await page.keyboard.type("22/02/2023");
    // const testDate = await page.evaluate() #senna_surface1 > div:nth-child(8) > div > div > div > div > div.ant-calendar-input-wrap > div > input
    await timeout(5000);

    // Thời gian bắt đầu (2)

    await timeout(1000);

    // await page
    //   .$eval(
    //     "#senna_surface1 > div:nth-child(9) > div > div > div > div > div.ant-calendar-input-wrap > div > input",
    //     (el, postingTimeEnd) => (el.value = postingTimeEnd || ""),
    //     postingTimeEnd
    //   )
    //   .catch((e) => {
    //     let error = new Error(e);
    //     logEvents(`searchAndGetLink---${id}---${error.message}`);
    //   });
    // // Thời gian đóng (1)

    // await page
    //   .$eval(
    //     "#search-advantage-haunt > div > div > div > div.content__body > div:nth-child(4) > div.content__body__session__desc > div > div:nth-child(1) > span > div > input",
    //     (form) => form.click()
    //   )
    //   .catch((e) => {
    //     let error = new Error(e);
    //     logEvents(`searchAndGetLink---${id}---${error.message}`);
    //   });

    // await page
    //   .$eval(
    //     "#senna_surface1 > div:nth-child(10) > div > div > div > div > div.ant-calendar-input-wrap > div > input",
    //     (el, bidCloseDateStart) => (el.value = bidCloseDateStart || ""),
    //     bidCloseDateStart
    //   )
    //   .catch((e) => {
    //     let error = new Error(e);
    //     logEvents(`searchAndGetLink---${id}---${error.message}`);
    //   });
    // // Thời gian đóng (2)

    // await page
    //   .$eval(
    //     "#search-advantage-haunt > div > div > div > div.content__body > div:nth-child(4) > div.content__body__session__desc > div > div:nth-child(3) > span > div > input",
    //     (form) => form.click()
    //   )
    //   .catch((e) => {
    //     let error = new Error(e);
    //     logEvents(`searchAndGetLink---${id}---${error.message}`);
    //   });

    // await page
    //   .$eval(
    //     "#senna_surface1 > div:nth-child(11) > div > div > div > div > div.ant-calendar-input-wrap > div > input",
    //     (el, bidCloseDateEnd) => (el.value = bidCloseDateEnd || ""),
    //     bidCloseDateEnd
    //   )
    //   .catch((e) => {
    //     let error = new Error(e);
    //     logEvents(`searchAndGetLink---${id}---${error.message}`);
    //   });
  }
  // Chủ đầu tư
  // await page
  //   .type(
  //     "#search-advantage-haunt > div > div > div > div.content__body > div:nth-child(6) > div.content__body__session__desc > input",
  //     investorsSearch || ""
  //   )
  //   .catch((e) => {
  //     let error = new Error(e);
  //     logEvents(`searchAndGetLink---${id}---${error.message}`);
  //   });
  // // Bên mời thầu
  // await page
  //   .type(
  //     "#search-advantage-haunt > div > div > div > div.content__body > div:nth-child(7) > div.content__body__session__desc > input",
  //     biddingPartysSearch || ""
  //   )
  //   .catch((e) => {
  //     let error = new Error(e);
  //     logEvents(`searchAndGetLink---${id}---${error.message}`);
  //   });

  // // Giá gói thầu ( từ )
  // if (moneyFrom) {
  //   await page
  //     .type(
  //       "#search-advantage-haunt > div > div > div > div.content__body > div:nth-child(11) > div.content__body__session__desc > div > div:nth-child(1) > input",
  //       moneyFrom + ""
  //     )
  //     .catch((e) => {
  //       let error = new Error(e);
  //       logEvents(`searchAndGetLink---${id}---${error.message}`);
  //     });
  // }
  // if (moneyTo) {
  //   // // Giá gói thầu ( đến )
  //   await page
  //     .type(
  //       "#search-advantage-haunt > div > div > div > div.content__body > div:nth-child(11) > div.content__body__session__desc > div > div:nth-child(3) > input",
  //       moneyTo + ""
  //     )
  //     .catch((e) => {
  //       let error = new Error(e);
  //       logEvents(`searchAndGetLink---${id}---${error.message}`);
  //     });
  // }

  /* Selecting a dropdown option. */
  // Quy trình áp dụng
  // await page.select(
  //   "#search-advantage-haunt > div > div > div > div.content__body > div:nth-child(12) > div.content__body__session__desc > div > select",
  //   "ADB" || ""
  // );

  // const selectElement = await page.$(
  //   "#search-advantage-haunt > div > div > div > div.content__body > div:nth-child(9) > div.content__body__session__desc > div > select:nth-child(1)"
  // );

  //linh vuc
  // if (fieldsId && fieldsId.length > 0) {
  //   fieldsId.map(async (f) => {
  //     await page
  //       .$eval(`#${f}`, (form) => form.click())
  //       .catch((err) => {
  //         logEvents(`searchAndGetLink---${id}---${err.message}`);
  //       });
  //   });
  // }
  //trongnuoc-quocte
  // if (isDomestic && isDomestic !== "") {
  //   await page
  //     .$eval(`#${isDomestic}`, (form) => form.click())
  //     .catch((e) => {
  //       let error = new Error(e);
  //       logEvents(`searchAndGetLink---${id}---${error.message}`);
  //     });
  // }
  // //quamang-k qua mang
  // if (biddingForm && biddingForm !== "") {
  //   await page
  //     .$eval(`#${biddingForm}`, (form) => form.click())
  //     .catch((e) => {
  //       let error = new Error(e);
  //       logEvents(`searchAndGetLink---${id}---${error.message}`);
  //     });
  // }
  // //chon tinh
  // await page
  //   .select(
  //     "#search-advantage-haunt > div > div > div > div.content__body > div:nth-child(9) > div.content__body__session__desc > div > select:nth-child(1)",
  //     provincesName || ""
  //   )
  //   .catch((e) => {
  //     let error = new Error(e);
  //     logEvents(`searchAndGetLink---${id}---${error.message}`);
  //   });
  // await timeout(1000);

  // //chon huyen
  // await page
  //   .select(
  //     "#search-advantage-haunt > div > div > div > div.content__body > div:nth-child(9) > div.content__body__session__desc > div > select.content__body__session__desc__select.form-control",
  //     districtsName || ""
  //   )
  //   .catch((e) => {
  //     let error = new Error(e);
  //     logEvents(`searchAndGetLink---${id}---${error.message}`);
  //   });

  // await page
  //   .select(
  //     "#search-advantage-haunt > div > div > div > div.content__body > div:nth-child(12) > div.content__body__session__desc > div > select",
  //     applyProcess || ""
  //   )
  //   .catch((e) => {
  //     let error = new Error(e);
  //     logEvents(`searchAndGetLink---${id}---${error.message}`);
  //   });

  await timeout(3000);

  // search
  await page
    .$eval(
      "#search-advantage-haunt > div > div > div > div.content__footer > button:nth-child(2)",
      (form) => form.click()
    )
    .catch((e) => {
      let error = new Error(e);
      logEvents(`searchAndGetLink---${id}---${error.message}`);
    });
  // await new Promise((resolve) => setTimeout(resolve, 10000));
  // // page number
  // const pages =
  //   (await page
  //     .$$eval(
  //       "#search-home > div.content__wrapper.background--white > div:nth-child(2) > div > div > ul > .number",
  //       (els) => els.map((e) => Number(e.textContent))
  //     )
  //     .catch((e) => {
  //       let error = new Error(e);
  //       logEvents(`searchAndGetLink---${id}---${error.message}`);
  //     })) ||
  //   (await page
  //     .$$eval(
  //       "#search-home > div.content__wrapper.background--white > div:nth-child(2) > div > div > ul > .number.active",
  //       (els) => els.map((e) => Number(e.textContent))
  //     )
  //     .catch((e) => {
  //       let error = new Error(e);
  //       logEvents(`searchAndGetLink---${id}---${error.message}`);
  //     }));

  // const numPages = Math.max.apply(Math, pages);

  // for (let i = 1; i <= numPages && i <= 100; i++) {
  //   // Lấy dữ liệu từ trang hiện tại
  //   console.log("check data", numPages);
  //   const data = await page
  //     .evaluate(() => {
  //       // Code lấy dữ liệu từ trang web
  //       const dataArray = [];
  //       let totalCount = 0;

  //       const divElements =
  //         document.querySelectorAll(".content__body__left__item") || 0;
  //       if (divElements === 0) return dataArray;

  //       divElements.forEach((content) => {
  //         try {
  //           let file;
  //           let links;
  //           let dataJson = {};
  //           dataJson.title = content.querySelector(
  //             ".col-md-8.content__body__left__item__infor__contract > a > h5"
  //           )
  //             ? content.querySelector(
  //                 ".col-md-8.content__body__left__item__infor__contract > a > h5"
  //               ).innerText
  //             : " ";

  //           dataJson.code = content.querySelector(
  //             ".d-flex.justify-content-between.align-items-center > p"
  //           )
  //             ? content.querySelector(
  //                 ".d-flex.justify-content-between.align-items-center > p"
  //               ).innerText
  //             : " ";

  //           // dataJson.benmoithau = content.querySelector(
  //           //   ".col-md-8.content__body__left__item__infor__contract__other.format__text > h6:nth-child(1) > span"
  //           // ).innerText;
  //           // if (
  //           //   content.querySelector(
  //           //     ".col-md-4.content__body__left__item__infor__contract__other > h6:nth-child(1) > span"
  //           //   )
  //           // ) {
  //           //   dataJson.linhvuc = content.querySelector(
  //           //     ".col-md-4.content__body__left__item__infor__contract__other > h6:nth-child(1) > span"
  //           //   ).innerText;

  //           //   dataJson.diadiem = content.querySelector(
  //           //     ".col-md-4.content__body__left__item__infor__contract__other > h6.format__text__title > span"
  //           //   ).innerText;
  //           // } else {
  //           //   dataJson.linhvuc = content.querySelector(
  //           //     ".col-md-4.content__body__left__item__infor__contract__other > h6"
  //           //   ).innerText;

  //           //   dataJson.diadiem = " ";
  //           // }

  //           // dataJson.endDate =
  //           //   content.querySelector(
  //           //     ".col-md-2.content__body__right__item__infor__contract > div > h5:nth-child(2)"
  //           //   ).innerText +
  //           //   " " +
  //           //   content.querySelector(
  //           //     ".col-md-2.content__body__right__item__infor__contract > div > h5:nth-child(3)"
  //           //   ).innerText;

  //           // dataJson.hinhthuc = content.querySelector(
  //           //   ".col-md-2.content__body__right__item__infor__contract > div > h5:nth-child(5)"
  //           // ).innerText;
  //           dataJson.status = content.querySelector(
  //             ".d-flex.justify-content-between.align-items-center > span"
  //           )
  //             ? content.querySelector(
  //                 ".d-flex.justify-content-between.align-items-center > span"
  //               ).innerText
  //             : " ";
  //           links = content.querySelector(
  //             ".col-md-8.content__body__left__item__infor__contract > a"
  //           )
  //             ? content.querySelector(
  //                 ".col-md-8.content__body__left__item__infor__contract > a"
  //               ).href
  //             : " ";
  //           const check_id_hs = links.match(/&id=([a-z0-9-]+)/);
  //           const id_ho_so = links && check_id_hs ? check_id_hs[1] : 0;
  //           file = `https://muasamcong.mpi.gov.vn/egp/contractorfe/viewer?formCode=ALL&id=${id_ho_so}&fileName=H%E1%BB%93%20s%C6%A1%20m%E1%BB%9Di%20th%E1%BA%A7u`;

  //           dataJson.p_id = id_ho_so;
  //           if (dataJson.code && check_id_hs) {
  //             const mtbmt = dataJson.code.split("-")[1];
  //             for (let i = 0; i <= mtbmt; i++) {
  //               let str = i.toString().padStart(2, "0");
  //               dataJson.version = str;
  //               dataArray.push({
  //                 file: file,
  //                 links: links,
  //                 ...dataJson,
  //               });
  //             }
  //           }
  //           totalCount = totalCount + 1;
  //         } catch (err) {
  //           let error = new Error(err);
  //           logEvents(`searchAndGetLink---${id}---${error.message}`);
  //         }
  //       });
  //       return { dataArray, totalCount };
  //     })
  //     .catch((e) => {
  //       let error = new Error(e);
  //       logEvents(`searchAndGetLink---${id}---${error.message}`);
  //     });
  //   console.log("checkData2 ", data);
  //   // Lưu dữ liệu vào mảng
  //   if (data && data.totalCount) {
  //     await MODELS.update(
  //       searchTerms,
  //       {
  //         totalCount: sequelize.literal(`totalCount + ${data.totalCount}`),
  //       },
  //       { where: { id: parseInt(id) } }
  //     ).catch((err) => {
  //       logEvents(`searchAndGetLink---${id}---${err.message}`);
  //     });
  //   }
  //   linkArray.push(
  //     ...data.dataArray.map((e) => {
  //       return { id: id, ...e };
  //     })
  //   );
  //   // console.log("dataArr", linkArray);
  //   // Click vào nút chuyển trang
  //   await new Promise((resolve) => setTimeout(resolve, 3000));
  //   if (i < numPages) {
  //     let nextButton = await page
  //       .$(
  //         "#search-home > div.content__wrapper.background--white > div:nth-child(1) > div.content__body__left > div:nth-child(1) > div > div > div > button.btn-next"
  //       )
  //       .catch((e) => {
  //         let error = new Error(e);
  //         logEvents(`searchAndGetLink---${id}---${error.message}`);
  //       });

  //     if (nextButton) {
  //       await nextButton.click().catch((e) => {
  //         let error = new Error(e);
  //         logEvents(`searchAndGetLink---${id}---${error.message}`);
  //       });
  //       await new Promise((resolve) => setTimeout(resolve, 1000));
  //     }
  //   }
  // }

  // await page.close();
};

export default searchAndGetLink;
