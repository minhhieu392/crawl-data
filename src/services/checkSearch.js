import _ from "lodash";
import moment from "moment";
import models from "../entity/index";
import MODELS from "../models/models";
const logEvents = require("../utils/logEvents");

const {
  searchTerms,
  provinces,
  districts,
  fields,
  searchTermsFields,
  applyProcess,
} = models;
const checkSearch = async (searchTermsRS, searchLoop) => {
  const a = await MODELS.findAll(searchTerms, {
    // logging: true,
    where: {
      $or: [
        { checkStatus: 0, loopType: 0 },
        {
          loopType: { $gt: 0 },
          loopStartEnd: {
            $gte: moment().format("YYYY-MM-DD"),
          },
          loopStartTime: {
            $gte: moment().format("YYYY-MM-DD"),
          },
        },
      ],
      status: 4,
    },
    include: [
      {
        model: provinces,
        as: "provinces",
        attributes: ["provincesName", "codeValue"],
        required: false,
      },
      {
        model: districts,
        as: "districts",
        attributes: ["districtsName", "codeValue"],
        required: false,
      },
      {
        model: applyProcess,
        as: "applyProcess",
        required: false,
      },
      {
        model: searchTermsFields,
        as: "searchTermsFields",
        include: [
          {
            model: fields,
            as: "fields",
            attributes: ["codeValue"],
            require: true,
          },
        ],
        required: false,
      },
    ],
  }).catch((e) => {
    let error = new Error(e);
    logEvents(`checkSearch---${error.message}`);
  });

  (a || []).map(async (b) => {
    // b.dataValues.provinces.dataValues.codeValue =
    //   b.dataValues.provinces.dataValues.codeValue || 0;
    // b.dataValues.districts.dataValues.codeValue =
    //   b.dataValues.districts.dataValues.codeValue || 0;
    // if (b.dataValues.searchTermsFields) {
    //   b.dataValues.searchTermsFields =
    //     b.dataValues.searchTermsFields.dataValues;
    //   console.log("searchTermsFields", b.dataValues.searchTermsFields);
    // }

    if (b.dataValues.postingTimeStart) {
      b.dataValues.postingTimeStart = moment(
        b.dataValues.postingTimeStart
      ).format("DD/MM/YYYY");
    }
    if (b.dataValues.postingTimeEnd) {
      b.dataValues.postingTimeEnd = moment(b.dataValues.postingTimeEnd).format(
        "DD/MM/YYYY"
      );
    }
    if (b.dataValues.bidCloseDateStart) {
      b.dataValues.bidCloseDateStart = moment(
        b.dataValues.bidCloseDateStart
      ).format("DD/MM/YYYY");
    }
    if (b.dataValues.bidCloseDateEnd) {
      b.dataValues.bidCloseDateEnd = moment(
        b.dataValues.bidCloseDateEnd
      ).format("DD/MM/YYYY");
    }
    // console.log("b", b.isDomestic);
    if (
      b.dataValues.isDomestic !== null &&
      Number(b.dataValues.isDomestic) === 0
    ) {
      b.dataValues.isDomestic = "isDomestic-0";
    }
    // console.log("b", b.isDomestic);

    if (
      b.dataValues.isDomestic !== null &&
      Number(b.dataValues.isDomestic) === 1
    ) {
      b.dataValues.isDomestic = "isDomestic-1";
    }

    if (
      b.dataValues.biddingForm !== null &&
      Number(b.dataValues.biddingForm) === 0
    ) {
      b.dataValues.biddingForm = "is-internet-0";
    }
    if (
      b.dataValues.biddingForm !== null &&
      Number(b.dataValues.biddingForm) === 1
    ) {
      b.dataValues.biddingForm = "is-internet-1";
    }

    if (b.applyProcess) {
      b.dataValues.applyProcess = b.applyProcess.codeValue;
    }
    if (b.searchTermsFields && b.searchTermsFields.length > 0) {
      b.dataValues.fieldsId = b.searchTermsFields.map(
        (e) => e.fields.codeValue
      );
    }
    if (b.dataValues.provinces) {
      b.dataValues.provincesName = b.dataValues.provinces.dataValues.codeValue;
    }
    if (b.dataValues.districts) {
      b.dataValues.districtsName = b.dataValues.districts.dataValues.codeValue;
    }

    if (Number(b.loopType) === 1 || Number(b.loopType) === 2) {
      searchLoop.push(b.dataValues);
    } else {
      searchTermsRS.push(b.dataValues);
    }
    await MODELS.update(
      searchTerms,
      { checkStatus: 1 },
      {
        where: {
          id: b.id,
        },
      }
    ).catch((e) => {
      let error = new Error(e);
      logEvents(`checkSearch---${error.message}`);
    });
  });
  //   a.map((b) => console.log("b", b.dataValues.provinces.dataValues.provincesName));

  // console.log("c", searchTermsRS);
};
export default checkSearch;
