module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "searchTerms",
    {
      id: {
        type: DataTypes.BIGINT(10),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "id",
      },
      searchTermsTitle: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: "searchTermsTitle",
      },
      search: {
        type: DataTypes.STRING(500),
        allowNull: false,
        field: "search",
      },
      investorsSearch: {
        type: DataTypes.STRING(500),
        allowNull: false,
        field: "investorsSearch",
      },
      biddingPartysSearch: {
        type: DataTypes.STRING(500),
        allowNull: false,
        field: "biddingPartysSearch",
      },
      // fieldsId: {
      //   type: DataTypes.BIGINT(20),
      //   allowNull: false,
      //   field: "fieldsId",
      // },
      provincesId: {
        type: DataTypes.BIGINT(20),
        allowNull: false,
        field: "provincesId",
      },
      districtsId: {
        type: DataTypes.BIGINT(20),
        allowNull: false,
        field: "districtsId",
      },
      moneyFrom: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        field: "moneyFrom",
      },
      moneyTo: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        field: "moneyTo",
      },
      biddingForm: {
        type: DataTypes.INTEGER(1),
        allowNull: true,
        field: "biddingForm",
      },
      isDomestic: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        field: "isDomestic",
      },
      loopType: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        field: "loopType",
      },
      repetitionHours: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        field: "repetitionHours",
      },
      status: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        field: "status",
      },
      checkStatus: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        field: "checkStatus",
      },
      weekdays: {
        type: DataTypes.JSON,
        allowNull: true,
        field: "weekdays",
      },
      userCreatorsId: {
        type: DataTypes.BIGINT(20),
        allowNull: true,
        field: "userCreatorsId",
      },
      dateUpdated: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        field: "dateUpdated",
      },
      dateCreated: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        field: "dateCreated",
      },
      postingTimeStart: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        field: "postingTimeStart",
      },
      postingTimeEnd: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        field: "postingTimeEnd",
      },
      bidCloseDateStart: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        field: "bidCloseDateStart",
      },
      bidCloseDateEnd: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        field: "bidCloseDateEnd",
      },
      loopStartTime: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        field: "loopStartTime",
      },
      loopStartEnd: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        field: "loopStartEnd",
      },
      currentCount: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        field: "currentCount",
      },
      totalCount: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        field: "totalCount",
      },
      applyProcessId: {
        type: DataTypes.BIGINT(20),
        allowNull: true,
        field: "applyProcessId",
      },
      timeStart: {
        type: DataTypes.STRING(200),
        allowNull: true,
        field: "timeStart",
      },
    },
    {
      tableName: "searchTerms",
      timestamps: false,
    }
  );
};
