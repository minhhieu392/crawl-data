import _ from "lodash";
import moment from "moment";
import models from "../entity/index";
import MODELS from "../models/models";
import { sequelize } from "../db/sequelize";
import { da } from "date-fns/locale";
const logEvents = require("../utils/logEvents");
const notifySlack = require("./testSlack");
const sendLog = require("./sendLogService");

const {
  bidsSearchTerms,
  bids,
  projects,
  biddingPartys,
  fields,
  districts,
  wards,
  provinces,
  searchTerms,
} = models;

const pushData = async (data, checkResult) => {
  // console.log("push data", data);
  const tenderNoticeFile = data.tenderNoticeFile ? data.tenderNoticeFile : null;
  const hsmt = data.hsmt ? data.hsmt : null;
  const inforData = data.infor;

  const co_quan_phe_duyet = inforData[0].co_quan_phe_duyet;
  const ngay_phe_duyet =
    inforData && inforData[0].ngay_phe_duyet
      ? moment(inforData[0].ngay_phe_duyet, "DD/MM/YYYY")
      : null;

  const so_quyet_dinh = inforData[0].so_quyet_dinh;
  const infoLength = inforData.length;
  var gia_goi_thau = 0;
  try {
    if (data.tien_dam_bao === "") {
      data.tien_dam_bao = null;
    }
    for (let i = 1; i < infoLength; i++) {
      if (inforData[i].ten_goi_thau === data.ten_goi_thau) {
        gia_goi_thau = parseFloat(
          inforData[i].gia_goi_thau.replace(/[^\d.-]/g, "").replace(/\./g, "")
        );
        break;
      }
    }
    if (data.typeData && data.typeData === 1) {
      gia_goi_thau = data.infor[0].money;
    }

    if (data.linh_vuc === "") {
      data.linh_vuc = 0;
    } else {
      const checkFields = await MODELS.findOne(fields, {
        where: {
          fieldsName: data.linh_vuc,
          status: 1,
        },
      }).catch((e) => {
        let error = new Error(e);
        logEvents(`pushData---${data.ma_TBMT}---${error.message}`);
      });
      if (checkFields) {
        data.linh_vuc = Number(checkFields.id);
      } else {
        const createFields = await MODELS.create(fields, {
          fieldsName: data.linh_vuc,
          status: 1,
          codeValue: "01",
        }).catch((e) => {
          let error = new Error(e);
          logEvents(`pushData---${data.ma_TBMT}---${error.message}`);
        });
        data.linh_vuc = Number(createFields.id);
      }
    }

    if (data.chu_dau_tu === "") {
      data.chu_dau_tu = 0;
    } else {
      const checkInvestorsId = await MODELS.findOne(biddingPartys, {
        where: { biddingPartysName: data.chu_dau_tu },
      }).catch((e) => {
        let error = new Error(e);
        logEvents(`pushData---${data.ma_TBMT}---${error.message}`);
      });
      if (checkInvestorsId) {
        data.chu_dau_tu = Number(checkInvestorsId.id);
      } else {
        const createInvestorsId = await MODELS.create(biddingPartys, {
          biddingPartysName: data.chu_dau_tu,
          biddingPartysCode: data.biddingPartysCode,
        }).catch((e) => {
          let error = new Error(e);
          logEvents(`pushData---${data.ma_TBMT}---${error.message}`);
        });
        if (createInvestorsId) data.chu_dau_tu = createInvestorsId.id;
      }
    }

    if (data.ben_moi_thau) {
      const checkBiddingPartysId = await MODELS.findOne(biddingPartys, {
        where: { biddingPartysName: data.ben_moi_thau },
      }).catch((e) => {
        let error = new Error(e);
        logEvents(`pushData---${data.ma_TBMT}---${error.message}`);
      });
      if (checkBiddingPartysId) {
        data.ben_moi_thau = Number(checkBiddingPartysId.id);
      } else {
        const createBiddingPartysId = await MODELS.create(biddingPartys, {
          biddingPartysName: data.ben_moi_thau,
          biddingPartysCode: data.biddingPartysCode,
        }).catch((e) => {
          let error = new Error(e);
          logEvents(`pushData---${data.ma_TBMT}---${error.message}`);
        });
        if (createBiddingPartysId) data.ben_moi_thau = createBiddingPartysId.id;
      }
    } else {
      throw new Error(
        "data.ben_moi_thau OR data.biddingPartysCode is not available."
      );
    }
    // console.log("check", data.ma_KHLCNT);
    let handleProjects;
    handleProjects = 0;
    if (data.ma_KHLCNT) {
      // console.log("1", data.ma_KHLCNT);
      const checkP = await MODELS.findOne(projects, {
        where: {
          khlcntCode: data.ma_KHLCNT,
        },
      }).catch((e) => {
        let error = new Error(e);
        logEvents(`pushData---${data.ma_TBMT}---${error.message}`);
      });
      if (checkP === null) {
        handleProjects = await MODELS.create(projects, {
          khlcntCode: data.ma_KHLCNT,
          khlcntName: data.ten_goi_thau,
          projectsName: data.ten_du_an_mua_sam,
          biddingPartysId: data.ben_moi_thau,
          money: data.infor[0].money,
          moneyString: data.infor[0].moneyString,
          approvalDecisionsNumber: so_quyet_dinh,
          approvalDecisionsDate: ngay_phe_duyet,
          approvalDecisionsAgencies: co_quan_phe_duyet,
          approvalDecisionsFile: "1",
          projectsTypeName: data.phan_loai_KHLCNT,
          investorsId: data.chu_dau_tu,
          url: data.url,
        }).catch((e) => {
          let error = new Error(e);
          logEvents(`pushData---${data.ma_TBMT}---${error.message}`);
        });
        handleProjects = handleProjects.id;
      } else {
        handleProjects = parseInt(checkP.id);
      }

      let parentId = -1;

      const findBids = await MODELS.findOne(bids, {
        where: { tbmtCode: data.ma_TBMT, parentId: 0 },
      }).catch((e) => {
        let error = new Error(e);
        logEvents(`pushData---${data.ma_TBMT}---${error.message}`);
      });
      if (findBids) {
        parentId = parseInt(findBids.id);
      } else {
        parentId = 0;
      }
      const createBids = await MODELS.create(bids, {
        tbmtCode: data.ma_TBMT,
        bidsName: data.ten_goi_thau,
        biddingPartysId: data.ben_moi_thau,
        investorsId: data.chu_dau_tu,
        capital: data.nguon_von,
        fieldsId: data.linh_vuc,
        contractorSelectionType: data.hinh_thuc_lua_chon_nha_thau,
        contractorSelectionMethod: data.phuong_thuc_lua_chon_nha_thau,
        contractType: data.loai_hop_dong,
        isDomestic: data.trongnuoc_quocte,
        contractDuration: data.thoi_gian_thuc_hien_hop_dong,
        biddingForm: data.hinh_thuc_dau_thau,
        locationRelease: data.dia_diem_phat_hanh_hsmt,
        locationPickUp: data.dia_diem_nhan_HSDT,
        expense: data.gia_ban_hsmt,
        locationOpening: data.dia_diem_mo_thau,
        startDate: data.thoi_diem_mo_thau,
        endDate: data.thoi_diem_dong_thau,
        bidValidity: data.hieu_luc_ho_so,
        approvalDecisionsNumber: data.so_quuet_dinh_phe_duyet,
        approvalDecisionsDate: data.ngay_phe_duyet,
        approvalDecisionsAgencies: data.co_quan_ban_hanh_quyet_dinh,
        bidGuarantee: data.hinh_thuc_dam_bao,
        url: data.url,
        money: data.tien_dam_bao,
        projectsId: parseInt(handleProjects),
        address: data.dia_diem_thuc_hien,
        totalMoney: gia_goi_thau,
        parentId: parentId,
        version: data.version,
        biddingDocumentLink: data.ho_so,
        tenderNoticeFile: tenderNoticeFile,
        biddingDocumentList: hsmt,
        dateCreated: data.ngay_dang_tai,
        status: data.status,
        biddingDocumentFile: "file",
        lastVersionStatus: data.lastVersionStatus,
      }).catch((e) => {
        let error = new Error(e);
        logEvents(`pushData---${data.ma_TBMT}---${error.message}`);
      });
      checkResult.push(data.ma_TBMT);
      // await notifySlack(log);
      await sendLog(data, createBids);
      if (createBids && data.version === "00") {
        const updateSearchTerm = await MODELS.update(
          searchTerms,
          {
            currentCount: sequelize.literal("currentCount + 1"),
          },
          { where: { id: parseInt(data.id) } }
        ).catch((e) => {
          let error = new Error(e);
          logEvents(`pushData---${data.ma_TBMT}---${error.message}`);
        });
        if (updateSearchTerm) {
          const checkTotal = await MODELS.findOne(searchTerms, {
            where: {
              id: parseInt(data.id),
            },
          }).catch((e) => {
            let error = new Error(e);
            console.log("err", e);
            logEvents(`pushData---${data.ma_TBMT}---${error.message}`);
          });
          if (
            checkTotal &&
            Number(checkTotal.currentCount) === Number(checkTotal.totalCount)
          ) {
            let typeEnd = data.loopType === "Tức thời" ? "End" : "End Section";

            const currentTime = moment().format("YYYY/MM/DD HH:mm");
            const log = `_${currentTime}_--*${typeEnd}*--*${data.loopType}* \n *${data.id}*--${data.searchTitle} \n curentCount: ${checkTotal.currentCount}`;
            await notifySlack(log);
          }
        }

        await MODELS.createOrUpdate(
          bidsSearchTerms,
          {
            bidsId: parseInt(createBids.id),
            searchTermsId: parseInt(data.id),
          },
          {
            where: {
              bidsId: parseInt(createBids.id),
              searchTermsId: parseInt(data.id),
            },
          }
        ).catch((e) => {
          let error = new Error(e);
          logEvents(`pushData---${data.ma_TBMT}---${error.message}`);
        });
      }

      console.log("done");
    } else {
      throw new Error("data.ma_KHLCNT is not available.");
    }
  } catch (e) {
    let error = new Error(e);
    logEvents(`pushData---${data.ma_TBMT}---${error.message}`);
  }
};

export default pushData;
