import MODELS from "../../models/models";
// import provinceModel from '../models/provinces'
import models from "../../entity/index";
import _ from "lodash";
import filterHelpers from "../../helpers/filterHelpers";
import ErrorHelpers from "../../helpers/errorHelpers";

const { newspapers } = models;

export default {
  get_list: (param) =>
    new Promise(async (resolve, reject) => {
      try {
        const { filter, range, sort, attributes } = param;
        let whereFilter = filter;

        console.log(filter);
        // try {
        //   whereFilter = filterHelpers.combineFromDateWithToDate(whereFilter);
        // } catch (error) {
        //   reject(error);
        // }

        // const perPage = range[1] - range[0] + 1;
        // const page = Math.floor(range[0] / perPage);
        // const att = filterHelpers.atrributesHelper(attributes);

        // whereFilter = await filterHelpers.makeStringFilterRelatively(['newsTitle'], whereFilter, 'news');

        if (!whereFilter) {
          whereFilter = { ...filter };
        }

        console.log("where", whereFilter);

        MODELS.findAndCountAll(newspapers, {
          where: whereFilter,
          // order: sort,
          //offset: range[0],
          // limit: perPage,
          logging: console.log,
          // attributes: att,
        })
          .then((result) => {
            console.log("result==", result);
            resolve({
              ...result,
              // page: page + 1,
              // perPage
            });
          })
          .catch((err) => {
            reject(
              ErrorHelpers.errorReject(err, "getListError", "newsService")
            );
          });
      } catch (err) {
        reject(ErrorHelpers.errorReject(err, "getListError", "newsService"));
      }
    }),
  updateLastTrackTimeForMany: async (checkUrlArray) => {
    let finnalyResult;

    try {
      const updateLastTrackTime = checkUrlArray.reduce(
        (converts, currentElement) => {
          const findElement = converts.find(
            (oldItem) => oldItem["newsPapersId"] === currentElement.newsPapersId
          );

          if (findElement) {
            console.log("findElement", currentElement);
            if (currentElement.lastTrackTime > findElement.lastTrackTime[0])
              findElement.lastTrackTime.unshift(currentElement.lastTrackTime);
          } else if (currentElement.lastTrackTime) {
            converts.push({
              newsPapersId: currentElement.newsPapersId,
              lastTrackTime: [currentElement.lastTrackTime],
            });
          }
          return converts;
        },
        []
      );

      // console.log("provinceModel create: ", updateLastTrackTime);

      finnalyResult = await Promise.all(
        updateLastTrackTime.map((element) => {
          return MODELS.update(
            newspapers,
            {
              lastTrackTime: element.lastTrackTime[0],
            },
            {
              where: { id: element.newsPapersId },
            }
          ).catch((error) => {
            throw new ApiErrors.BaseError({
              statusCode: 202,
              type: "crudError",
              error,
            });
          });
        })
      );
      console.log("finnalyResult", finnalyResult);
      if (!finnalyResult) {
        console.log("err2");
      }
    } catch (error) {
      console.log("err3", error);
    }

    return { result: finnalyResult };
  },
};
