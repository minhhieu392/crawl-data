import MODELS from "../../models/models";
// import provinceModel from '../models/provinces'
import models from "../../entity/index";
import _ from "lodash";
import * as ApiErrors from "../../errors";
import ErrorHelpers from "../../helpers/errorHelpers";
const { sequelize, news, configs, disastersNews, disasters, typeOfNews } =
  models;

export default {
  createOrUpdate: async (param) => {
    let finnalyResult;

    // try {
    const entity = param.entity;
    let newDetail = entity;
    console.log("entity.newsTitle", entity.newsTitle);
    if (entity.newsTitle) {
      if (
        entity.dateUpdated == null ||
        entity.dateCreated == null ||
        entity.dateUpdated == "" ||
        entity.dateCreated == ""
      ) {
        // console.log("newsService create: ", entity);
        newDetail = _.pick(entity, [
          "newsTitle",
          "image",
          "newsShortDescription",
          "newsDescription",
          "newsAuthor",
          "newspapersId",
          "newsSource",
          "userCreatorsId",
          "status",
          "url",
        ]);
      }

      // /*
      const objectNews = await MODELS.findOne(news, {
        where: {
          newsSource: entity.newsSource,
        },
      });
      if (!objectNews) {
        finnalyResult = await MODELS.create(news, {
          ...newDetail,
        }).catch((error) => {
          console.log("error", error);
          throw new ApiErrors.BaseError({
            statusCode: 202,
            type: "crudError",
            error,
          });
        });
        console.log("created succesfull");
        // const resultNewsSlugs = sequelize.query(
        //   "call sp_news_urlSlugs(:in_newsId, :in_urlSlug)",
        //   {
        //     replacements: {
        //       in_newsId: finnalyResult.id || 0,
        //       in_urlSlug: entity.urlRewrite || "",
        //     },
        //     type: sequelize.QueryTypes.SELECT,
        //   }
        // );
      } else {
        finnalyResult = await MODELS.update(
          news,
          { ...newDetail },
          {
            where: {
              id: objectNews.id,
            },
          }
        ).catch((error) => {
          console.log("error", error);
          throw new ApiErrors.BaseError({
            statusCode: 202,
            type: "crudError",
            error,
          });
        });
        console.log("update succesfull");
        // const resultArticleSlugs = sequelize.query(
        //   "call sp_news_urlSlugs(:in_newsId, :in_urlSlug)",
        //   {
        //     replacements: {
        //       in_newsId: objectNews.id || 0,
        //       in_urlSlug: entity.urlRewrite || "",
        //     },
        //     type: sequelize.QueryTypes.SELECT,
        //   }
        // );
      }

      if (!finnalyResult) {
        throw new ApiErrors.BaseError({
          statusCode: 202,
          type: "crudInfo",
          message: viMessage["api.message.infoAfterCreateError"],
        });
      }
      // console.log("disasters", disasters);
    }

    // /*

    // */
    // } catch (error) {
    //   ErrorHelpers.errorThrow(error, 'crudError', 'newsService');
    // }
    return { result: finnalyResult };
  },
};
