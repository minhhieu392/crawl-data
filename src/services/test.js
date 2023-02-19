// let url =
//   "https://muasamcong.mpi.gov.vn/web/guest/contractor-selection?p_p_id=egpportalcontractorselectionv2_WAR_egpportalcontractorselectionv2&p_p_lifecycle=0&p_p_state=normal&p_p_mode=view&_egpportalcontractorselectionv2_WAR_egpportalcontractorselectionv2_render=detail&type=es-notify-contractor&stepCode=notify-contractor-step-1-tbmt&id=7e768a68-b5ff-48e4-8f10-ba2daff68bc7&notifyId=7e768a68-b5ff-48e4-8f10-ba2daff68bc7&inputResultId=undefined&bidOpenId=undefined&techReqId=undefined&bidPreNotifyResultId=undefined&bidPreOpenId=undefined&processApply=LDT&bidMode=1_MTHS&notifyNo=IB2300011580&planNo=PL2300001461&pno=undefined";
// let result = url.match(/&id=([a-z0-9-]+)/)[1];
// console.log("Result:", result);
// import moment from "moment";
// const str = "16/01/2023";
// const date = moment(str, "DD/MM/YYYY");
// console.log(date);
// const str = "55.000.000.000 VND";
// const number = parseFloat(str.replace(/[^\d.-]/g, "").replace(/\./g, ""));
// console.log(number); // Output: 55000000000
// let str = "Thành phố Vinh, Tỉnh Nghệ An";
// let parts = str.split(", ");
// let a = parts[0].split(" ").pop();
// let b = parts[1].split(" ").pop();

// console.log(a);
// console.log(b);
// const data = [
//   "Tây Ninh",
//   "Hà Nam",
//   "Nam Định",
//   "Thái Bình",
//   "Khánh Hoà",
//   "Ninh Bình ",
//   "Bình Dương",
//   "Đồng Nai",
//   "Bình Thuận",
//   "Bà Rịa - Vũng Tàu",
//   "Hà Giang",
//   "Cao Bằng",
//   "Thanh Hoá",
//   "Nghệ An",
//   "Kon Tum",
//   "Lào Cai",
//   "Bắc Kạn ",
//   "Long An",
//   "Hà Tĩnh",
//   "Gia Lai",
//   "Lạng Sơn",
//   "Quảng Bình",
//   "Đồng Tháp",
//   "Đăk Lăk",
//   "Đăk Nông",
//   "An Giang",
//   "Quảng Trị",
//   "Tiền Giang",
//   "Vĩnh Long",
//   "Tuyên Quang",
//   "Yên Bái",
//   "Thừa Thiên Huế",
//   "Thái Nguyên",
//   "Phú Thọ",
//   "Bến Tre",
//   "Vĩnh Phúc",
//   "Kiên Giang",
//   "Thành phố Cần Thơ",
//   "Hậu Giang",
//   "Sóc Trăng",
//   "Bắc Giang",
//   "Trà Vinh",
//   "Thành phố Hà Nội",
//   "Bắc Ninh",
//   "Thành phố Hải Phòng",
//   "Điện Biên ",
//   "Quảng Ninh",
//   "Lai Châu",
//   "Sơn La",
//   "Thành phố Đà Nẵng",
//   "Bạc Liêu",
//   "Hoà Bình",
//   "Quảng Nam",
//   "TP. Hồ Chí Minh",
//   "Hải Dương",
//   "Cà Mau",
//   "Hưng Yên",
//   "Lâm Đồng",
//   "Quảng Ngãi",
//   "Bình Định ",
//   "Ninh Thuận",
//   "Phú Yên ",
//   "Bình Phước",
// ];
// const result = [];
// for (let i = 0; i < data.length; i++) {
//   result.push(
//     `INSERT INTO 'goithau'.'provinces' ('provincesName', 'status') VALUES ("${data[i]}", 1);`
//   );
// }
// console.log(result);
import moment from "moment";
import models from "../entity/index";
import MODELS from "../models/models";
import _ from "lodash";

const { districts, provinces } = models;

// var request = require("request");
const https = require("https");
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

const axios = require("axios");

const data = async (arrData) => {
  for (var i = 0; i < arrData.length; i++) {
    console.log(arrData);
    console.log(`ddd,"${arrData[i]}"`);

    await new Promise((resolve) => setTimeout(resolve, 500));

    const data = {
      areaType: "2",
      parentCode: `${arrData[i]}`,
    };

    axios
      .post(
        "https://muasamcong.mpi.gov.vn/o/egp-portal-contractor-selection-v2/services/get/area-api",
        data,
        {
          httpsAgent: new https.Agent({
            rejectUnauthorized: false,
          }),
        }
      )
      .then(function (response) {
        console.log("ok", response.data);
        const res = response.data;
        const resArr = res.areas;
        console.log(response.body);

        resArr.map(
          async (arr) =>
            await MODELS.create(districts, {
              districtsName: arr.name,
              provincesId: i + 6,
              status: 1,
              userCreatorsId: 0,
              codeValue: arr.code,
            }).catch((err) => {
              console.log(err);
            })
        );
        // console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log("lôix");

        console.log(error);
      });

    // request(options, function (error, response) {
    //   if (error) throw new Error(error);
    // });
  }
};
//   // const data = async (arr) => {
//   //   console.log("arr", arr);
//   //   for (let i = 0; i < arr.length; i++) {
//   //     await MODELS.create(districts, {
//   //       districtsName: arr[i].name,

//   //       provincesId: 31,
//   //       status: 1,
//   //       userCreatorsId: 0,
//   //     }).catch((err) => {
//   //       console.log(err);
//   //     });
//   //   }
//   // };
// };

// const data = async (arrData) => {
//   for (var i = 7; i < 69; i++) {
//     await new Promise((resolve) => setTimeout(resolve, 2000));

//     await MODELS.update(
//       provinces,
//       { codeValue: arrData[i - 7] },
//       {
//         where: {
//           id: i,
//         },
//       }
//     );
//     console.log(arrData[i - 7]);
//   }
// };
export default data;
