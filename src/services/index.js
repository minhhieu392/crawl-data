import { cafefCategory, cafefNewDetail } from "./cafefServices";
import { ndhCategory, ndhNewDetail } from "./ndhServices";
import {
  tinnhanhchungkhoanCategory,
  tinnhanhchungkhoanNewDetail,
} from "./tinnhanhchungkhoanServices";
import { vietnambizCategory, vietnambizNewDetail } from "./vietnambizServices";
import { vietstockCategory, vietstockNewDetail } from "./vietSockServices";
const categoryService = {
  vietstock: vietstockCategory,
  vietnambiz: vietnambizCategory,
  tinnhanhchungkhoan: tinnhanhchungkhoanCategory,
  cafef: cafefCategory,
  ndh: ndhCategory,
};

const detailService = {
  vietstock: vietstockNewDetail,
  vietnambiz: vietnambizNewDetail,
  tinnhanhchungkhoan: tinnhanhchungkhoanNewDetail,
  cafef: cafefNewDetail,
  ndh: ndhNewDetail,
};

const newObject = [
  {
    key: "vietstock",
    paginationAndreload: 0,
  },
  {
    key: "vietnambiz",
    paginationAndreload: 1,
  },
  {
    key: "cafef",
    paginationAndreload: 0,
  },
  {
    key: "ndh",
    paginationAndreload: 0,
  },
  {
    key: "tinnhanhchungkhoan",
    paginationAndreload: 0,
  },
];

module.exports = {
  categoryService,
  detailService,
  newObject,
};
