import MODELS from "../../models/models";
// import provinceModel from '../models/provinces'
import models from "../../entity/index";
import _ from "lodash";
import * as ApiErrors from "../../errors";
import moment from "moment";
import filterHelpers from "../../helpers/filterHelpers";
const { sequelize, article } = models;

export default {
  createOrUpdate: async (param) => {
    console.log("param", param);
    let finnalyResult;

    // try {
    // const entity = param.entity;
    // let newDetail = entity;
    // // console.log("newDetail",newDetail)
    // if (entity.title) {
    //   if (entity.createDate == null || entity.createDate == "") {
    //     // console.log("newsService create: ", entity);
    //     newDetail = _.pick(entity, [
    //       "title",
    //       "shortDescription",
    //       "description",
    //       "image",
    //       "author",
    //       "source",
    //       "tag",
    //       "seoKeywords",
    //       "seoDescriptions",
    //       "categoriesId",
    //       "usersCreatorId",
    //       "createDate",
    //       "status",
    //       "urlSlugs",
    //       "languagesId",
    //     ]);
    //   }
    //   let whereFilter = {
    //     categoriesId: entity.categoriesId,
    //     title: entity.title,
    //   };
    //   /* whereFilter = await filterHelpers.makeStringFilterRelatively(['title'], whereFilter, 'article');

    //     finnalyResult = await MODELS.createOrUpdate(article, {
    //       ...newDetail,
    //     },
    //     {
    //         where:whereFilter
    //     }).catch((error) => {
    //       console.log("error", error);
    //       throw new ApiErrors.BaseError({
    //         statusCode: 202,
    //         type: "crudError",
    //         error,
    //       });
    //     });
    //     console.log("created succesfull");*/
    //   console.log("created succesfull1");
    //   const resultNewsSlugs = sequelize.query(
    //     "call sp_article_InsertOrUpdate(:in_title, :in_shortDescription,:in_description,:in_image,:in_author,:in_source,:in_tag,:in_seoKeywords,:in_seoDescriptions,:in_categoriesId,:in_urlSlugs,:in_createDate);",
    //     {
    //       replacements: {
    //         in_title: newDetail.title || "",
    //         in_shortDescription: newDetail.shortDescription || "",
    //         in_description: newDetail.description || "",
    //         in_image: newDetail.image || "",
    //         in_author: newDetail.author || "",
    //         in_source: newDetail.source || "",
    //         in_tag: newDetail.tag || "",
    //         in_seoKeywords: newDetail.seoKeywords || "",
    //         in_seoDescriptions: newDetail.seoDescriptions || "",
    //         in_categoriesId: newDetail.categoriesId || 0,
    //         in_urlSlugs: newDetail.urlSlugs || "",
    //         in_createDate: moment(newDetail.createDate).format(
    //           "YYYY-MM-DD HH:mm:ss"
    //         ),
    //       },
    //       type: sequelize.QueryTypes.SELECT,
    //     }
    //   );

    //   console.log("created succesfull2=", JSON.stringify(resultNewsSlugs));

    //   // if (!finnalyResult) {
    //   //   throw new ApiErrors.BaseError({
    //   //     statusCode: 202,
    //   //     type: "crudInfo",
    //   //     message: viMessage["api.message.infoAfterCreateError"],
    //   //   });
    //   // }
    //   // console.log("disasters", disasters);
    // }
    return { result: finnalyResult };
  },
};
