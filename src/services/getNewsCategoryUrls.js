import { newObject } from "./index";
import moment from "moment";
const getDate = (startDate, timeLength) => {
  let dates = [];
  startDate = startDate ? startDate : new Date();
  for (let i = 0; i < timeLength; i++) {
    let date = moment(startDate).subtract(i, "days").format("DD-MM-YYYY");
    dates.push(date);
  }
  return dates;
};

const getNewsCategoryUrls = (newspapersData, pageSizeConfig) => {
  let urls = [];

  newspapersData.forEach((newspaper) => {
    newspaper.newspaperUrl.forEach((newspaperUrl) => {
      newObject.forEach((newObjectElement) => {
        if (newspaperUrl.includes(newObjectElement.key)) {
          if (newObjectElement.paginationAndreload == 0) {
            urls.push({
              id: newspaper.id,
              url: newspaperUrl,
              pagesize: pageSizeConfig,
              keyword: newspaper.newspaperKeyword,
              key: newObjectElement.key,
              categoriesId: newspaper.categoriesId,
              lastTrackTime: newspaper.lastTrackTime,
            });
          } else if (newObjectElement.paginationAndreload == 1) {
            for (let pageSize = 1; pageSize <= pageSizeConfig; pageSize++) {
              urls.push({
                id: newspaper.id,
                url: newspaperUrl,
                pagesize: pageSize,
                keyword: newspaper.newspaperKeyword,
                key: newObjectElement.key,
                categoriesId: newspaper.categoriesId,
                lastTrackTime: newspaper.lastTrackTime,
              });
            }
          }
        }
      });
    });
  });
  return urls;
};

export default getNewsCategoryUrls;
