import { da } from "date-fns/locale";
import _ from "lodash";
import moment from "moment";
const https = require("https");
// const httpsAgent = new https.Agent({
//   rejectUnauthorized: false,
// });
const axios = require("axios");
const logEvents = require("../utils/logEvents");
//scroll paginationAndreload ==0

const searchAndGetLink = async (
  page,
  linkAndData,
  dataArray,
  urlDownloadAray
) => {
  // console.log("a", linkAndData);

  await page.goto(linkAndData.links);
  const client = await page
    .target()
    .createCDPSession()
    .catch((e) => {
      let error = new Error(e);
      logEvents(`getDetails---${linkAndData.links}---${error.message}`);
    });
  let urlDownload;
  const check_id_hs = linkAndData.links.match(/&id=([a-z0-9-]+)/);
  const ho_so =
    linkAndData.links && check_id_hs
      ? check_id_hs[1]
      : linkAndData.links.match(/&id=([A-Z0-9-]+)/)[1];
  if (check_id_hs) {
    urlDownload = `https://muasamcong.mpi.gov.vn/egp/contractorfe/viewer?formCode=ALL&id=${ho_so}&fileName=H%E1%BB%93%20s%C6%A1%20m%E1%BB%9Di%20th%E1%BA%A7u`;
  }
  let biddingPartysCode = "";
  const req = {
    id: `${ho_so}`,
  };

  try {
    const response = await axios.post(
      "https://muasamcong.mpi.gov.vn/o/egp-portal-contractor-selection-v2/services/expose/lcnt/bid-po-bido-notify-contractor-view/get-by-id",
      req,
      {
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
      }
    );

    const res = response.data;
    const resArr = res.bidoNotifyContractorM;
    biddingPartysCode = resArr?.investorCode;
  } catch (error) {
    console.error(error);
  }

  await page.waitForTimeout(12000);
  let lastVersionStatus = 0;
  let check_index_version = true;
  if (
    linkAndData &&
    linkAndData.versionStatus &&
    linkAndData.version === "00"
  ) {
    lastVersionStatus = 1;
    await page
      .$eval(
        "#info-general > div:nth-child(2) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(3) > div:nth-child(2) > span > select > option",
        (form) => form.click()
      )
      .catch((e) => {
        let error = new Error(e);
        logEvents(`getDetails---${linkAndData.links}---${error.message}`);
      });
  } else {
    const indexVersion = await page.evaluate(() => {
      const rows = document.querySelectorAll(
        "#info-general > div:nth-child(2) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(3) > div:nth-child(2) > span > select > option"
      );

      const indexVersion = [];
      for (const row of rows) {
        indexVersion.push(row.innerText);
      }
      return indexVersion;
    });

    // console.log(
    //   "indexOf(parseInt(linkAndData.version)",
    //   parseInt(linkAndData.version)
    // );
    // console.log("indexVersion", indexVersion);

    const index = indexVersion.indexOf(linkAndData.version);
    if (index !== -1) {
      const version = index + 1;
      await page
        .$eval(
          `#info-general > div:nth-child(2) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(3) > div:nth-child(2) > span > select > option:nth-child(${version})`,
          (form) => form.click()
        )
        .catch((e) => {
          let error = new Error(e);
          logEvents(`getDetails---${linkAndData.links}---${error.message}`);
        });
      if (version === indexVersion.length) {
        lastVersionStatus = 1;
      }
    } else {
      check_index_version = false;
    }
  }

  if (check_index_version) {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    // lấy dữ liệu từ trang
    const data = await page
      .evaluate(() => {
        const jsonLinks = {};
        jsonLinks.ma_TBMT = document.querySelector(
          "#info-general > div:nth-child(2) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(1) > div:nth-child(2)"
        )
          ? document.querySelector(
              "#info-general > div:nth-child(2) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(1) > div:nth-child(2)"
            ).innerText
          : "";

        jsonLinks.ngay_dang_tai = document.querySelector(
          "#info-general > div:nth-child(2) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(2) > div:nth-child(2)"
        )
          ? document.querySelector(
              "#info-general > div:nth-child(2) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(2) > div:nth-child(2)"
            ).innerText
          : "";

        jsonLinks.ma_KHLCNT = document.querySelector(
          "#info-general > div:nth-child(3) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(1) > div.text-blue-4D7AE6"
        )
          ? document.querySelector(
              "#info-general > div:nth-child(3) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(1) > div.text-blue-4D7AE6"
            ).innerText
          : "";

        jsonLinks.phan_loai_KHLCNT = document.querySelector(
          "#info-general > div:nth-child(3) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(2) > div:nth-child(2)"
        )
          ? document.querySelector(
              "#info-general > div:nth-child(3) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(2) > div:nth-child(2)"
            ).innerText
          : "";

        document.querySelector(
          "#info-general > div:nth-child(3) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(3) > div:nth-child(2)"
        )
          ? (jsonLinks.ten_du_an_mua_sam = document.querySelector(
              "#info-general > div:nth-child(3) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(3) > div:nth-child(2)"
            ).innerText)
          : (jsonLinks.ten_du_an_mua_sam = "");

        jsonLinks.ten_goi_thau = document.querySelector(
          "#info-general > div:nth-child(4) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(1) > div:nth-child(2)"
        )
          ? document.querySelector(
              "#info-general > div:nth-child(4) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(1) > div:nth-child(2)"
            ).innerText
          : "";

        if (
          document.querySelector(
            "#info-general > div:nth-child(4) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(10) > div:nth-child(2)"
          )
        ) {
          jsonLinks.chu_dau_tu = document.querySelector(
            "#info-general > div:nth-child(4) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(2) > div:nth-child(2)"
          )
            ? document.querySelector(
                "#info-general > div:nth-child(4) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(2) > div:nth-child(2)"
              ).innerText
            : "";

          jsonLinks.ben_moi_thau = document.querySelector(
            "#info-general > div:nth-child(4) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(3) > div:nth-child(2)"
          )
            ? document.querySelector(
                "#info-general > div:nth-child(4) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(3) > div:nth-child(2)"
              ).innerText
            : "";

          jsonLinks.nguon_von = document.querySelector(
            "#info-general > div:nth-child(4) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(4) > div:nth-child(2)"
          )
            ? document.querySelector(
                "#info-general > div:nth-child(4) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(4) > div:nth-child(2)"
              ).innerText
            : "";

          jsonLinks.linh_vuc = document.querySelector(
            "#info-general > div:nth-child(4) > div.card-body.d-flex.flex-column.align-items-start.infomation > div.d-flex.flex-row.align-items-start.infomation__content.w-100 > div:nth-child(2)"
          )
            ? document.querySelector(
                "#info-general > div:nth-child(4) > div.card-body.d-flex.flex-column.align-items-start.infomation > div.d-flex.flex-row.align-items-start.infomation__content.w-100 > div:nth-child(2)"
              ).innerText
            : "";

          jsonLinks.hinh_thuc_lua_chon_nha_thau = document.querySelector(
            "#info-general > div:nth-child(4) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(6) > div:nth-child(2)"
          )
            ? document.querySelector(
                "#info-general > div:nth-child(4) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(6) > div:nth-child(2)"
              ).innerText
            : "";

          jsonLinks.loai_hop_dong = document.querySelector(
            "#info-general > div:nth-child(4) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(7) > div:nth-child(2)"
          )
            ? document.querySelector(
                "#info-general > div:nth-child(4) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(7) > div:nth-child(2)"
              ).innerText
            : "";

          //trong nước - quốc tế

          document.querySelector(
            "#info-general > div:nth-child(4) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(8) > div:nth-child(2)"
          ).innerText === "Trong nước"
            ? (jsonLinks.trongnuoc_quocte = 1)
            : (jsonLinks.trongnuoc_quocte = 0);

          jsonLinks.phuong_thuc_lua_chon_nha_thau = document.querySelector(
            "#info-general > div:nth-child(4) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(9) > div:nth-child(2)"
          )
            ? document.querySelector(
                "#info-general > div:nth-child(4) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(9) > div:nth-child(2)"
              ).innerText
            : "";

          jsonLinks.thoi_gian_thuc_hien_hop_dong = document.querySelector(
            "#info-general > div:nth-child(4) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(10) > div:nth-child(2)"
          )
            ? document.querySelector(
                "#info-general > div:nth-child(4) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(10) > div:nth-child(2)"
              ).innerText
            : "";
        } else {
          jsonLinks.chu_dau_tu = "";
          jsonLinks.ben_moi_thau = document.querySelector(
            "#info-general > div:nth-child(4) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(2) > div:nth-child(2)"
          )
            ? document.querySelector(
                "#info-general > div:nth-child(4) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(2) > div:nth-child(2)"
              ).innerText
            : "";

          jsonLinks.nguon_von = document.querySelector(
            "#info-general > div:nth-child(4) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(3) > div:nth-child(2)"
          )
            ? document.querySelector(
                "#info-general > div:nth-child(4) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(3) > div:nth-child(2)"
              ).innerText
            : "";

          jsonLinks.linh_vuc = document.querySelector(
            "#info-general > div:nth-child(4) > div.card-body.d-flex.flex-column.align-items-start.infomation > div.d-flex.flex-row.align-items-start.infomation__content.w-100 > div:nth-child(2)"
          )
            ? document.querySelector(
                "#info-general > div:nth-child(4) > div.card-body.d-flex.flex-column.align-items-start.infomation > div.d-flex.flex-row.align-items-start.infomation__content.w-100 > div:nth-child(2)"
              ).innerText
            : "";

          jsonLinks.hinh_thuc_lua_chon_nha_thau = document.querySelector(
            "#info-general > div:nth-child(4) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(5) > div:nth-child(2)"
          )
            ? document.querySelector(
                "#info-general > div:nth-child(4) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(5) > div:nth-child(2)"
              ).innerText
            : "";

          jsonLinks.loai_hop_dong = document.querySelector(
            "#info-general > div:nth-child(4) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(6) > div:nth-child(2)"
          )
            ? document.querySelector(
                "#info-general > div:nth-child(4) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(6) > div:nth-child(2)"
              ).innerText
            : "";

          document.querySelector(
            "#info-general > div:nth-child(4) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(7) > div:nth-child(2)"
          ).innerText === "Trong nước"
            ? (jsonLinks.trongnuoc_quocte = 1)
            : (jsonLinks.trongnuoc_quocte = 0);

          jsonLinks.phuong_thuc_lua_chon_nha_thau = document.querySelector(
            "#info-general > div:nth-child(4) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(8) > div:nth-child(2)"
          )
            ? document.querySelector(
                "#info-general > div:nth-child(4) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(8) > div:nth-child(2)"
              ).innerText
            : "";

          jsonLinks.thoi_gian_thuc_hien_hop_dong = document.querySelector(
            "#info-general > div:nth-child(4) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(9) > div:nth-child(2)"
          )
            ? document.querySelector(
                "#info-general > div:nth-child(4) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(9) > div:nth-child(2)"
              ).innerText
            : "";
        }

        // hình thức đấu thầu
        document.querySelector(
          "#info-general > div:nth-child(5) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(1) > div:nth-child(2) > span"
        ).innerText === "Qua mạng"
          ? (jsonLinks.hinh_thuc_dau_thau = 0)
          : (jsonLinks.hinh_thuc_dau_thau = 1);

        jsonLinks.dia_diem_phat_hanh_hsmt = document.querySelector(
          "#info-general > div:nth-child(5) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(2) > div:nth-child(2)"
        )
          ? document.querySelector(
              "#info-general > div:nth-child(5) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(2) > div:nth-child(2)"
            ).innerText
          : "";

        //chi phí nộp hồ sơ
        const gb_hsmt = document.querySelector(
          "#info-general > div:nth-child(5) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(3) > div:nth-child(2)"
        )
          ? document.querySelector(
              "#info-general > div:nth-child(5) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(3) > div:nth-child(2)"
            ).innerText
          : "";

        jsonLinks &&
          gb_hsmt &&
          (jsonLinks.gia_ban_hsmt = parseFloat(
            gb_hsmt.replace(/,/g, "").replace(" VND", "")
          )
            ? parseFloat(gb_hsmt.replace(/,/g, "").replace(" VND", ""))
            : 0);

        jsonLinks.dia_diem_nhan_HSDT = document.querySelector(
          "#info-general > div:nth-child(5) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(4) > div:nth-child(2)"
        )
          ? document.querySelector(
              "#info-general > div:nth-child(5) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(4) > div:nth-child(2)"
            ).innerText
          : "";

        jsonLinks.dia_diem_thuc_hien = document.querySelector(
          "#info-general > div:nth-child(5) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(5) > div:nth-child(2) > p"
        )
          ? document.querySelector(
              "#info-general > div:nth-child(5) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(5) > div:nth-child(2) > p"
            ).innerText
          : "";

        jsonLinks.thoi_diem_dong_thau = document.querySelector(
          "#info-general > div:nth-child(6) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(1) > div:nth-child(2)"
        )
          ? document.querySelector(
              "#info-general > div:nth-child(6) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(1) > div:nth-child(2)"
            ).innerText
          : "";

        // const tdmt =;
        jsonLinks.thoi_diem_mo_thau = document.querySelector(
          "#info-general > div:nth-child(6) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(2) > div:nth-child(2)"
        )
          ? document.querySelector(
              "#info-general > div:nth-child(6) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(2) > div:nth-child(2)"
            ).innerText
          : "";

        jsonLinks.dia_diem_mo_thau = document.querySelector(
          "#info-general > div:nth-child(6) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(3) > div:nth-child(2)"
        )
          ? document.querySelector(
              "#info-general > div:nth-child(6) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(3) > div:nth-child(2)"
            ).innerText
          : "";

        jsonLinks.hieu_luc_ho_so = document.querySelector(
          "#info-general > div:nth-child(6) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(4) > div:nth-child(2)"
        )
          ? document.querySelector(
              "#info-general > div:nth-child(6) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(4) > div:nth-child(2)"
            ).innerText
          : "";
        const tien_dam_bao_raw = document.querySelector(
          "#info-general > div:nth-child(6) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(5) > div:nth-child(2)"
        )
          ? document.querySelector(
              "#info-general > div:nth-child(6) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(5) > div:nth-child(2)"
            ).innerText
          : "";

        jsonLinks &&
          tien_dam_bao_raw &&
          (jsonLinks.tien_dam_bao = parseFloat(
            tien_dam_bao_raw.replace(/[^\d.-]/g, "").replace(/\./g, "")
          )
            ? parseFloat(
                tien_dam_bao_raw.replace(/[^\d.-]/g, "").replace(/\./g, "")
              )
            : 0);

        document.querySelector(
          "#info-general > div:nth-child(6) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(6) > div:nth-child(2)"
        )
          ? (jsonLinks.hinh_thuc_dam_bao = document.querySelector(
              "#info-general > div:nth-child(6) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(6) > div:nth-child(2)"
            ).innerText)
          : (jsonLinks.hinh_thuc_dam_bao = "");

        jsonLinks.so_quuet_dinh_phe_duyet = document.querySelector(
          "#info-general > div:nth-child(7) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(1) > div:nth-child(2)"
        )
          ? document.querySelector(
              "#info-general > div:nth-child(7) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(1) > div:nth-child(2)"
            ).innerText
          : "";

        //ngày phê duyệt
        jsonLinks.ngay_phe_duyet = document.querySelector(
          "#info-general > div:nth-child(7) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(2) > div:nth-child(2)"
        )
          ? document.querySelector(
              "#info-general > div:nth-child(7) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(2) > div:nth-child(2)"
            ).innerText
          : "";

        jsonLinks.co_quan_ban_hanh_quyet_dinh = document.querySelector(
          "#info-general > div:nth-child(7) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(3) > div:nth-child(2)"
        )
          ? document.querySelector(
              "#info-general > div:nth-child(7) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(3) > div:nth-child(2)"
            ).innerText
          : "";
        // chuyen trang
        return jsonLinks;
      })
      .catch((e) => {
        let error = new Error(e);
        logEvents(`getDetails---${linkAndData.links}---${error.message}`);
      });
    try {
      // console.log("checkdata", data);
      data &&
        data.ngay_phe_duyet &&
        (data.ngay_phe_duyet = moment(data.ngay_phe_duyet, "DD/MM/YYYY"));
      data &&
        data.thoi_diem_dong_thau &&
        (data.thoi_diem_dong_thau = moment(
          data.thoi_diem_dong_thau,
          "DD/MM/YYYY"
        ));
      data &&
        data.thoi_diem_mo_thau &&
        (data.thoi_diem_mo_thau = moment(data.thoi_diem_mo_thau, "DD/MM/YYYY"));
      data &&
        data.ngay_dang_tai &&
        (data.ngay_dang_tai = moment(
          data.ngay_dang_tai,
          "DD-MM-YYYY HH:mm:ss"
        ));

      data.ho_so = urlDownload || null;
      data.url = linkAndData.links ? linkAndData.links : null;
      // if (linkAndData.links) {
      //   data.url = linkAndData.links;
      // } else {
      //   data.url = null;
      // }
      data.biddingPartysCode = biddingPartysCode || null;
      // console.log("biddingPartysCode", biddingPartysCode);
      //1--
    } catch (e) {
      let error = new Error(e);
      logEvents(`getDetails---${linkAndData.links}---${error.message}`);
    }
    //1--
    if (check_id_hs) {
      await page
        .evaluate(() => {
          document.querySelector("#info-general > div.mb-2 > span").click();
        })
        .catch((e) => {
          let error = new Error(e);
          logEvents(`getDetails---${linkAndData.links}---${error.message}`);
        });

      const fileName = data && data.ma_TBMT ? `${data.ma_TBMT}` : "123";

      await client
        .send("Page.setDownloadBehavior", {
          behavior: "allow",
          downloadPath: process.env.DOWLOADPATH_TBMT
            ? process.env.DOWLOADPATH_TBMT.replace(/\//g, "\\") + fileName
            : undefined,
        })
        .catch((e) => {
          let error = new Error(e);
          logEvents(`getDetails---${linkAndData.links}---${error.message}`);
        });

      data && (data.tenderNoticeFile = `${fileName}\\_Thông báo mời thầu.pdf`);

      // console.log("tenderNoticeFile", data.tenderNoticeFile);
      // console.log("tbmt", data.ma_TBMT);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // chuyen sang ho so moi thau
      await page
        .$eval("#tenderNotice > ul > li:nth-child(2) > a", (form) =>
          form.click()
        )
        .catch((e) => {
          let error = new Error(e);
          logEvents(`getDetails---${linkAndData.links}---${error.message}`);
        });
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const data_hsmt = await page
        .evaluate(() => {
          const elm_hsmt = document.querySelector(
            "#file-tender-invitation > div > div > table > tbody"
          )
            ? document.querySelector(
                "#file-tender-invitation > div > div > table > tbody"
              ).innerHTML
            : "";
          return elm_hsmt;
        })
        .catch((e) => {
          let error = new Error(e);
          logEvents(`getDetails---${linkAndData.links}---${error.message}`);
        });
      data.hsmt = data_hsmt || "";
      //quay tro lai
      await page
        .$eval("#tenderNotice > ul > li:nth-child(1) > a", (form) =>
          form.click()
        )
        .catch((e) => {
          let error = new Error(e);
          logEvents(`getDetails---${linkAndData.links}---${error.message}`);
        });
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await page
      .evaluate(() => {
        document
          .querySelector(
            "#info-general > div:nth-child(3) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(1) > div.text-blue-4D7AE6"
          )
          .click();
      })
      .catch((e) => {
        let error = new Error(e);
        logEvents(`getDetails---${linkAndData.links}---${error.message}`);
      });
    await new Promise((resolve) => setTimeout(resolve, 15000));

    // await page.waitForSelector("tbody", { visible: true });
    const infor = await page
      .evaluate(() => {
        // Lấy dữ liệu từ trang mới
        const rows = document.querySelectorAll(
          ".card-body.item-table > table > tbody > tr"
        );

        const infor = [];
        const gia_goi_thau = document.querySelector(
          "#tab1 > div:nth-child(2) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(1) > div:nth-child(2) > span"
        )
          ? document.querySelector(
              "#tab1 > div:nth-child(2) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(1) > div:nth-child(2) > span"
            ).innerText
          : "0 VND";

        const gia_goi_thau_chu = document.querySelector(
          "#tab1 > div:nth-child(2) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(3) > div:nth-child(2)"
        )
          ? document.querySelector(
              "#tab1 > div:nth-child(2) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(3) > div:nth-child(2)"
            ).innerText
          : "#tab1 > div:nth-child(2) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(2) > div:nth-child(2)";

        const so_quyet_dinh = document.querySelector(
          "#tab1 > div:nth-child(3) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(1) > div:nth-child(2)"
        )
          ? document.querySelector(
              "#tab1 > div:nth-child(3) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(1) > div:nth-child(2)"
            ).innerText
          : "";

        const ngay_phe_duyet = document.querySelector(
          "#tab1 > div:nth-child(3) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(2) > div:nth-child(2)"
        )
          ? document.querySelector(
              "#tab1 > div:nth-child(3) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(2) > div:nth-child(2)"
            ).innerText
          : "";

        const co_quan_phe_duyet = document.querySelector(
          "#tab1 > div:nth-child(3) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(3) > div:nth-child(2)"
        )
          ? document.querySelector(
              "#tab1 > div:nth-child(3) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(3) > div:nth-child(2)"
            ).innerText
          : "";

        infor.push({
          money: parseFloat(
            gia_goi_thau.replace(/[^\d.-]/g, "").replace(/\./g, "")
          ),
          moneyString: gia_goi_thau_chu,
          so_quyet_dinh: so_quyet_dinh,
          ngay_phe_duyet: ngay_phe_duyet,
          co_quan_phe_duyet: co_quan_phe_duyet,
        });
        for (const row of rows) {
          const cells = row.querySelectorAll("td");
          const [stt, ten_goi_thau, linh_vuc_gt, gia_goi_thau, nguon_von] =
            cells;
          infor.push({
            stt: stt.innerText,
            ten_goi_thau: ten_goi_thau.innerText,
            linh_vuc_gt: linh_vuc_gt.innerText,
            gia_goi_thau: gia_goi_thau.innerText,
            nguon_von: nguon_von.innerText,
          });
        }
        return infor;
      })
      .catch((e) => {
        let error = new Error(e);
        logEvents(`getDetails---${linkAndData.links}---${error.message}`);
      });
    const url = {};
    const statusMap = {
      "Không có nhà thầu trúng thầu": -3,
      "Chưa đóng thầu": 0,
      "Đã hủy TBMT": -2,
      "Đang xét thầu": 1,
      "Có nhà thầu trúng thầu": 2,
      "Đã huỷ thầu": -1,
    };

    if (linkAndData.status && statusMap[linkAndData.status] !== undefined) {
      data.status = statusMap[linkAndData.status];
    }

    url.code_tbmt = data.ma_TBMT;
    url.urlPath = data.ho_so;
    data.id = linkAndData.id;
    data.loopType = linkAndData.loopType;
    data.searchTitle = linkAndData.searchTitle;
    data.infor = infor;
    data.version = linkAndData.version;
    urlDownloadAray.push(url);
    data.lastVersionStatus = lastVersionStatus;
    // console.log("data", data);
    dataArray.push(data);
    await page.close();
  } else {
    await page.close();
  }
};

export default searchAndGetLink;
