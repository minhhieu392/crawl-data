import _ from "lodash";
import models from "../entity/index";
import MODELS from "../models/models";
import { sequelize } from "../db/sequelize";
import moment from "moment";
const logEvents = require("../utils/logEvents");
const notifySlack = require("./testSlack");
// const sendLog = require("./sendLogService");
// import moment from "moment";

const { searchTerms } = models;

//scroll paginationAndreload ==0

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const searchAndGetLink = async (
  page,
  optionSearch = {},
  linkArray,
  arrSpecial
) => {
  await page.goto(
    "https://muasamcong.mpi.gov.vn/web/guest/contractor-selection?render=search"
  );

  const {
    id,
    searchTermsTitle,
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
    loopType,
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
  if (postingTimeStart) {
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
    // await new Promise((resolve) => setTimeout(resolve, 5000));

    await page.keyboard.type(postingTimeStart);
  }
  if (postingTimeEnd) {
    // Thời gian bắt đầu (2)
    // await new Promise((resolve) => setTimeout(resolve, 4000));
    await page
      .$eval(
        "#search-advantage-haunt > div > div > div > div.content__body > div:nth-child(3) > div.content__body__session__desc > div > div:nth-child(1) > span > div > input",
        (form) => form.click()
      )
      .catch((e) => {
        let error = new Error(e);
        logEvents(`searchAndGetLink---${id}---${error.message}`);
      });
    await page.keyboard.type(postingTimeEnd);
  }
  if (bidCloseDateStart) {
    // // Thời gian đóng (1)
    await page
      .$eval(
        "#search-advantage-haunt > div > div > div > div.content__body > div:nth-child(4) > div.content__body__session__desc > div > div:nth-child(1) > span > div > input",
        (form) => form.click()
      )
      .catch((e) => {
        let error = new Error(e);
        logEvents(`searchAndGetLink---${id}---${error.message}`);
      });
    await page.keyboard.type(bidCloseDateStart);
  }
  if (bidCloseDateEnd) {
    // // Thời gian đóng (2)
    await page
      .$eval(
        "#search-advantage-haunt > div > div > div > div.content__body > div:nth-child(4) > div.content__body__session__desc > div > div:nth-child(3) > span > div > input",
        (form) => form.click()
      )
      .catch((e) => {
        let error = new Error(e);
        logEvents(`searchAndGetLink---${id}---${error.message}`);
      });
    await page.keyboard.type(bidCloseDateEnd);
  }
  // Chủ đầu tư
  await page
    .type(
      "#search-advantage-haunt > div > div > div > div.content__body > div:nth-child(6) > div.content__body__session__desc > input",
      investorsSearch || ""
    )
    .catch((e) => {
      let error = new Error(e);
      logEvents(`searchAndGetLink---${id}---${error.message}`);
    });
  // Bên mời thầu
  await page
    .type(
      "#search-advantage-haunt > div > div > div > div.content__body > div:nth-child(7) > div.content__body__session__desc > input",
      biddingPartysSearch || ""
    )
    .catch((e) => {
      let error = new Error(e);
      logEvents(`searchAndGetLink---${id}---${error.message}`);
    });

  // Giá gói thầu ( từ )
  if (moneyFrom) {
    await page
      .type(
        "#search-advantage-haunt > div > div > div > div.content__body > div:nth-child(11) > div.content__body__session__desc > div > div:nth-child(1) > input",
        moneyFrom + ""
      )
      .catch((e) => {
        let error = new Error(e);
        logEvents(`searchAndGetLink---${id}---${error.message}`);
      });
  }
  if (moneyTo) {
    // // Giá gói thầu ( đến )
    await page
      .type(
        "#search-advantage-haunt > div > div > div > div.content__body > div:nth-child(11) > div.content__body__session__desc > div > div:nth-child(3) > input",
        moneyTo + ""
      )
      .catch((e) => {
        let error = new Error(e);
        logEvents(`searchAndGetLink---${id}---${error.message}`);
      });
  }

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
  if (fieldsId && fieldsId.length > 0) {
    fieldsId.map(async (f) => {
      await page
        .$eval(`#${f}`, (form) => form.click())
        .catch((err) => {
          logEvents(`searchAndGetLink---${id}---${err.message}`);
        });
    });
  }
  //trongnuoc-quocte
  if (isDomestic && isDomestic !== "") {
    await page
      .$eval(`#${isDomestic}`, (form) => form.click())
      .catch((e) => {
        let error = new Error(e);
        logEvents(`searchAndGetLink---${id}---${error.message}`);
      });
  }
  //quamang-k qua mang
  if (biddingForm && biddingForm !== "") {
    await page
      .$eval(`#${biddingForm}`, (form) => form.click())
      .catch((e) => {
        let error = new Error(e);
        logEvents(`searchAndGetLink---${id}---${error.message}`);
      });
  }
  //chon tinh
  await page
    .select(
      "#search-advantage-haunt > div > div > div > div.content__body > div:nth-child(9) > div.content__body__session__desc > div > select:nth-child(1)",
      provincesName || ""
    )
    .catch((e) => {
      let error = new Error(e);
      logEvents(`searchAndGetLink---${id}---${error.message}`);
    });
  await timeout(1000);

  //chon huyen
  await page
    .select(
      "#search-advantage-haunt > div > div > div > div.content__body > div:nth-child(9) > div.content__body__session__desc > div > select.content__body__session__desc__select.form-control",
      districtsName || ""
    )
    .catch((e) => {
      let error = new Error(e);
      logEvents(`searchAndGetLink---${id}---${error.message}`);
    });

  await page
    .select(
      "#search-advantage-haunt > div > div > div > div.content__body > div:nth-child(12) > div.content__body__session__desc > div > select",
      applyProcess || ""
    )
    .catch((e) => {
      let error = new Error(e);
      logEvents(`searchAndGetLink---${id}---${error.message}`);
    });

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
  await new Promise((resolve) => setTimeout(resolve, 9000));
  // page number

  const loopMap = {
    0: "Tức thời",
    1: "Theo giờ",
    2: "Theo ngày",
  };
  let type_of_loop;
  // console.log("type_of_loop", loopType, loopMap[loopType]);

  if (loopType !== null && loopMap[loopType] !== undefined) {
    type_of_loop = loopMap[loopType];
  }

  const totalPage = await page
    .evaluate(() => {
      return document.querySelector(
        "#search-home > div.content__wrapper.background--white > div:nth-child(1) > label"
      ).innerText;
    })
    .catch((e) => {
      let error = new Error(e);
      logEvents(`searchAndGetLink---${id}---${error.message}`);
    });
  const total = totalPage.split(" ")[2];
  const currentTime = moment().format("YYYY/MM/DD HH:mm");
  const log = `_${currentTime}_--*Start*--*${type_of_loop}* \n *${optionSearch.id}*--${searchTermsTitle} \n total: ${total}`;
  await notifySlack(log);
  // await sendLog(optionSearch.id, log);

  await MODELS.update(
    searchTerms,
    {
      totalCount: Number(total),
      currentCount: 0,
    },
    { where: { id: parseInt(id) } }
  ).catch((err) => {
    logEvents(`searchAndGetLink---${id}---${err.message}`);
  });

  const pages =
    (await page
      .$$eval(
        "#search-home > div.content__wrapper.background--white > div:nth-child(2) > div > div > ul > .number",
        (els) => els.map((e) => Number(e.textContent))
      )
      .catch((e) => {
        let error = new Error(e);
        logEvents(`searchAndGetLink---${id}---${error.message}`);
      })) ||
    (await page
      .$$eval(
        "#search-home > div.content__wrapper.background--white > div:nth-child(2) > div > div > ul > .number.active",
        (els) => els.map((e) => Number(e.textContent))
      )
      .catch((e) => {
        let error = new Error(e);
        logEvents(`searchAndGetLink---${id}---${error.message}`);
      }));

  const numPages = Math.max.apply(Math, pages);

  for (let i = 1; i <= numPages && i <= 100; i++) {
    // Lấy dữ liệu từ trang hiện tại
    // console.log("check data", numPages);
    const data = await page
      .evaluate(() => {
        // Code lấy dữ liệu từ trang web
        const dataSpecial = [];
        const dataArray = [];
        let totalCount = 0;

        const divElements =
          document.querySelectorAll(".content__body__left__item") || 0;
        if (divElements === 0) return dataArray;

        divElements.forEach((content) => {
          try {
            let file;
            let links;
            let dataJson = {};
            dataJson.title = content.querySelector(
              ".col-md-8.content__body__left__item__infor__contract > a > h5"
            )
              ? content.querySelector(
                  ".col-md-8.content__body__left__item__infor__contract > a > h5"
                ).innerText
              : " ";

            dataJson.code = content.querySelector(
              ".d-flex.justify-content-between.align-items-center > p"
            )
              ? content.querySelector(
                  ".d-flex.justify-content-between.align-items-center > p"
                ).innerText
              : " ";

            // dataJson.benmoithau = content.querySelector(
            //   ".col-md-8.content__body__left__item__infor__contract__other.format__text > h6:nth-child(1) > span"
            // ).innerText;
            // if (
            //   content.querySelector(
            //     ".col-md-4.content__body__left__item__infor__contract__other > h6:nth-child(1) > span"
            //   )
            // ) {
            //   dataJson.linhvuc = content.querySelector(
            //     ".col-md-4.content__body__left__item__infor__contract__other > h6:nth-child(1) > span"
            //   ).innerText;

            //   dataJson.diadiem = content.querySelector(
            //     ".col-md-4.content__body__left__item__infor__contract__other > h6.format__text__title > span"
            //   ).innerText;
            // } else {
            //   dataJson.linhvuc = content.querySelector(
            //     ".col-md-4.content__body__left__item__infor__contract__other > h6"
            //   ).innerText;

            //   dataJson.diadiem = " ";
            // }

            // dataJson.endDate =
            //   content.querySelector(
            //     ".col-md-2.content__body__right__item__infor__contract > div > h5:nth-child(2)"
            //   ).innerText +
            //   " " +
            //   content.querySelector(
            //     ".col-md-2.content__body__right__item__infor__contract > div > h5:nth-child(3)"
            //   ).innerText;

            // dataJson.hinhthuc = content.querySelector(
            //   ".col-md-2.content__body__right__item__infor__contract > div > h5:nth-child(5)"
            // ).innerText;
            dataJson.status = content.querySelector(
              ".d-flex.justify-content-between.align-items-center > span"
            )
              ? content.querySelector(
                  ".d-flex.justify-content-between.align-items-center > span"
                ).innerText
              : " ";
            links = content.querySelector(
              ".col-md-8.content__body__left__item__infor__contract > a"
            )
              ? content.querySelector(
                  ".col-md-8.content__body__left__item__infor__contract > a"
                ).href
              : " ";
            const check_id_hs = links.match(/&id=([a-z0-9-]+)/);
            const id_ho_so = links && check_id_hs ? check_id_hs[1] : 0;

            dataJson.p_id = id_ho_so;
            if (dataJson.code && check_id_hs) {
              const mtbmt = dataJson.code.split("-")[1];
              if (mtbmt === "00") {
                dataJson.versionStatus = 0;
              }
              for (let i = 0; i <= mtbmt; i++) {
                let str = i.toString().padStart(2, "0");
                dataJson.version = str;
                dataArray.push({
                  links: links,
                  ...dataJson,
                });
              }
            } else if (dataJson.code && !id_ho_so) {
              const mtbmt = dataJson.code.split("-")[1];
              if (mtbmt === "00") {
                dataJson.versionStatus = 0;
              }
              for (let i = 0; i <= mtbmt; i++) {
                let str = i.toString().padStart(2, "0");
                dataJson.version = str;
                dataSpecial.push({
                  links: links,
                  ...dataJson,
                });
              }
            }
            totalCount = totalCount + 1;
          } catch (err) {
            let error = new Error(err);
            logEvents(`searchAndGetLink---${id}---${error.message}`);
          }
        });
        return { dataArray, totalCount, dataSpecial };
      })
      .catch((e) => {
        let error = new Error(e);
        logEvents(`searchAndGetLink---${id}---${error.message}`);
      });
    // Lưu dữ liệu vào mảng

    linkArray.push(
      ...data.dataArray.map((e) => {
        return {
          id: id,
          loopType: type_of_loop,
          searchTitle: searchTermsTitle,
          ...e,
        };
      })
    );
    console.log("type_of_loop", type_of_loop);
    arrSpecial.push(
      ...data.dataSpecial.map((e) => {
        return {
          id: id,
          loopType: type_of_loop,
          searchTitle: searchTermsTitle,
          ...e,
        };
      })
    );

    // console.log("linkarr", linkArray);
    // console.log("arrSpecial", arrSpecial);
    // Click vào nút chuyển trang
    await new Promise((resolve) => setTimeout(resolve, 1500));
    if (i < numPages) {
      let nextButton = await page
        .$(
          "#search-home > div.content__wrapper.background--white > div:nth-child(1) > div.content__body__left > div:nth-child(1) > div > div > div > button.btn-next"
        )
        .catch((e) => {
          let error = new Error(e);
          logEvents(`searchAndGetLink---${id}---${error.message}`);
        });

      if (nextButton) {
        await nextButton.click().catch((e) => {
          let error = new Error(e);
          logEvents(`searchAndGetLink---${id}---${error.message}`);
        });
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
  }

  await page.close();
};

export default searchAndGetLink;
