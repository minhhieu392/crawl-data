import { da } from "date-fns/locale";
import _ from "lodash";
import moment from "moment";
const https = require("https");
const axios = require("axios");
const logEvents = require("../utils/logEvents");
//scroll paginationAndreload ==0

const getDetailSpecial = async (page, linkAndData, dataArray) => {
  // console.log("a", linkAndData);

  await page.goto(linkAndData.links);

  await page.waitForTimeout(12000);
  // console.log("dddd", linkAndData.links);
  let check_index_version = true;
  if (linkAndData.version === "00") {
    await page
      .$eval(
        "#contractorSelectionResults > div:nth-child(1) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(2) > div:nth-child(2) > span > select",
        (form) => form.click()
      )
      .catch((e) => {
        let error = new Error(e);
        logEvents(`getDetails---${linkAndData.links}---${error.message}`);
      });
  } else {
    const indexVersion = await page.evaluate(() => {
      const rows = document.querySelectorAll(
        "#contractorSelectionResults > div:nth-child(1) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(2) > div:nth-child(2) > span > select > option"
      );

      const indexVersion = [];
      for (const row of rows) {
        indexVersion.push(row.innerText);
      }
      return indexVersion;
    });
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
          "#contractorSelectionResults > div:nth-child(1) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(1) > div:nth-child(2)"
        )
          ? document.querySelector(
              "#contractorSelectionResults > div:nth-child(1) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(1) > div:nth-child(2)"
            ).innerText
          : "";

        jsonLinks.ngay_dang_tai = document.querySelector(
          "#contractorSelectionResults > div:nth-child(1) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(4) > div:nth-child(2)"
        )
          ? document.querySelector(
              "#contractorSelectionResults > div:nth-child(1) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(4) > div:nth-child(2)"
            ).innerText
          : "";

        jsonLinks.ma_KHLCNT = document.querySelector(
          "#contractorSelectionResults > div:nth-child(1) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(6) > div:nth-child(2)"
        )
          ? document.querySelector(
              "#contractorSelectionResults > div:nth-child(1) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(6) > div:nth-child(2)"
            ).innerText
          : "";

        jsonLinks.phan_loai_KHLCNT = null;

        jsonLinks.ten_goi_thau = document.querySelector(
          "#contractorSelectionResults > div:nth-child(1) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(7) > div:nth-child(2)"
        )
          ? document.querySelector(
              "#contractorSelectionResults > div:nth-child(1) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(7) > div:nth-child(2)"
            ).innerText
          : "";
        jsonLinks.ten_du_an_mua_sam = jsonLinks.ten_goi_thau;
        jsonLinks.chu_dau_tu = "";

        jsonLinks.ben_moi_thau = document.querySelector(
          "#contractorSelectionResults > div:nth-child(1) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(5) > div:nth-child(2)"
        )
          ? document.querySelector(
              "#contractorSelectionResults > div:nth-child(1) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(5) > div:nth-child(2)"
            ).innerText
          : "";

        jsonLinks.nguon_von = null;

        jsonLinks.linh_vuc = document.querySelector(
          "#contractorSelectionResults > div:nth-child(1) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(13) > div:nth-child(2)"
        )
          ? document.querySelector(
              "#contractorSelectionResults > div:nth-child(1) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(13) > div:nth-child(2)"
            ).innerText
          : "";

        jsonLinks.hinh_thuc_lua_chon_nha_thau = document.querySelector(
          "#contractorSelectionResults > div:nth-child(1) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(11) > div:nth-child(2)"
        )
          ? document.querySelector(
              "#contractorSelectionResults > div:nth-child(1) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(11) > div:nth-child(2)"
            ).innerText
          : "";

        jsonLinks.loai_hop_dong = document.querySelector(
          "#contractorSelectionResults > div:nth-child(1) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(10) > div:nth-child(2)"
        )
          ? document.querySelector(
              "#contractorSelectionResults > div:nth-child(1) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(10) > div:nth-child(2)"
            ).innerText
          : "";

        document.querySelector(
          "#contractorSelectionResults > div:nth-child(1) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(18) > div:nth-child(2) > span"
        ).innerText === "Trong nước"
          ? (jsonLinks.trongnuoc_quocte = 1)
          : (jsonLinks.trongnuoc_quocte = 0);

        jsonLinks.phuong_thuc_lua_chon_nha_thau = document.querySelector(
          "#contractorSelectionResults > div:nth-child(1) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(12) > div:nth-child(2)"
        )
          ? document.querySelector(
              "#contractorSelectionResults > div:nth-child(1) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(12) > div:nth-child(2)"
            ).innerText
          : "";

        jsonLinks.thoi_gian_thuc_hien_hop_dong = null;

        // hình thức đấu thầu
        jsonLinks.hinh_thuc_dau_thau = null;

        jsonLinks.dia_diem_phat_hanh_hsmt = null;

        //chi phí nộp hồ sơ
        jsonLinks.gia_ban_hsmt = null;

        jsonLinks.dia_diem_nhan_HSDT = null;

        jsonLinks.dia_diem_thuc_hien = null;

        jsonLinks.thoi_diem_dong_thau = null;

        // const tdmt =;
        jsonLinks.thoi_diem_mo_thau = null;

        jsonLinks.dia_diem_mo_thau = null;

        jsonLinks.hieu_luc_ho_so = null;

        jsonLinks.tien_dam_bao = null;

        jsonLinks.hinh_thuc_dam_bao = null;
        jsonLinks.so_quuet_dinh_phe_duyet = document.querySelector(
          "#contractorSelectionResults > div:nth-child(1) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(16) > div:nth-child(2)"
        )
          ? document.querySelector(
              "#contractorSelectionResults > div:nth-child(1) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(16) > div:nth-child(2)"
            ).innerText
          : "";

        //ngày phê duyệt
        jsonLinks.ngay_phe_duyet = document.querySelector(
          "#contractorSelectionResults > div:nth-child(1) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(14) > div:nth-child(2)"
        )
          ? document.querySelector(
              "#contractorSelectionResults > div:nth-child(1) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(14) > div:nth-child(2)"
            ).innerText
          : "";

        jsonLinks.co_quan_ban_hanh_quyet_dinh = document.querySelector(
          "#contractorSelectionResults > div:nth-child(1) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(15) > div:nth-child(2)"
        )
          ? document.querySelector(
              "#contractorSelectionResults > div:nth-child(1) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(15) > div:nth-child(2)"
            ).innerText
          : "";

        return jsonLinks;
      })
      .catch((e) => {
        let error = new Error(e);
        logEvents(`getDetails---${linkAndData.links}---${error.message}`);
      });
    try {
      data &&
        data.ngay_phe_duyet &&
        (data.ngay_phe_duyet = moment(data.ngay_phe_duyet, "DD/MM/YYYY"));
      data &&
        data.ngay_dang_tai &&
        (data.ngay_dang_tai = moment(
          data.ngay_dang_tai,
          "DD-MM-YYYY HH:mm:ss"
        ));

      data.ho_so = null;
      data.url = linkAndData.links;
      data.biddingPartysCode = null;
    } catch (e) {
      let error = new Error(e);
      logEvents(`getDetails---${linkAndData.links}---${error.message}`);
    }

    data.hsmt = null;
    //quay tro lai
    const infor = await page.evaluate(() => {
      const infor = [];

      const gia_goi_thau = document.querySelector(
        "#contractorSelectionResults > div:nth-child(1) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(9) > div:nth-child(2)"
      )
        ? document.querySelector(
            "#contractorSelectionResults > div:nth-child(1) > div.card-body.d-flex.flex-column.align-items-start.infomation > div:nth-child(9) > div:nth-child(2)"
          ).innerText
        : "0 VND";

      infor.push({
        money: parseFloat(
          gia_goi_thau.replace(/[^\d.-]/g, "").replace(/\./g, "")
        ),
        moneyString: null,
        so_quyet_dinh: null,
        ngay_phe_duyet: null,
        co_quan_phe_duyet: null,
        ten_goi_thau: null,
        gia_goi_thau: null,
        nguon_von: null,
      });
      return infor;
    });

    const url = {};
    const statusMap = {
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
    data.biddingPartysCode = null;
    data.version = linkAndData.version;
    data.typeData = 1;
    // console.log("data", data);
    dataArray.push(data);
    await page.close();
  } else {
    await page.close;
  }
};

export default getDetailSpecial;
