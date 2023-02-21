module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "bids",
    {
      id: {
        type: DataTypes.BIGINT(10),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "id",
      },
      bidGuarantee: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: "bidGuarantee",
      },
      money: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        field: "money",
      },
      totalMoney: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        field: "totalMoney",
      },
      approvalDecisionsAgencies: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: "approvalDecisionsAgencies",
      },
      approvalDecisionsDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "approvalDecisionsDate",
      },
      approvalDecisionsNumber: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: "approvalDecisionsNumber",
      },
      address: {
        type: DataTypes.STRING(200),
        allowNull: true,
        field: "address",
      },
      bidValidity: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: "bidValidity",
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        field: "endDate",
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        field: "startDate",
      },
      locationOpening: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: "locationOpening",
      },
      expense: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        field: "expense",
      },
      locationPickUp: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: "locationPickUp",
      },
      locationRelease: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: "locationRelease",
      },
      contractDuration: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: "contractDuration",
      },
      biddingForm: {
        type: DataTypes.INTEGER(1),
        allowNull: true,
        field: "biddingForm",
      },
      isDomestic: {
        type: DataTypes.INTEGER(1),
        allowNull: true,
        field: "isDomestic",
      },
      contractType: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: "contractType",
      },
      contractorSelectionMethod: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: "contractorSelectionMethod",
      },
      contractorSelectionType: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: "contractorSelectionType",
      },
      fieldsId: {
        type: DataTypes.BIGINT(20),
        allowNull: true,
        field: "fieldsId",
      },
      capital: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: "capital",
      },
      investorsId: {
        type: DataTypes.BIGINT(20),
        allowNull: true,
        field: "investorsId",
      },
      projectsId: {
        type: DataTypes.BIGINT(20),
        allowNull: true,
        field: "projectsId",
      },
      biddingPartysId: {
        type: DataTypes.BIGINT(20),
        allowNull: true,
        field: "biddingPartysId",
      },
      tbmtCode: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: "tbmtCode",
      },
      bidsName: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: "bidsName",
      },
      url: {
        type: DataTypes.STRING(1000),
        allowNull: true,
        field: "url",
      },
      dateCreated: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        field: "dateCreated",
      },
      dateUpdated: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        field: "dateUpdated",
      },
      biddingDocumentList: {
        type: DataTypes.JSON,
        allowNull: true,
        field: "biddingDocumentList",
      },
      tenderNoticeFile: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: "tenderNoticeFile",
      },
      biddingDocumentFile: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: "biddingDocumentFile",
      },
      biddingDocumentLink: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: "biddingDocumentLink",
      },
      version: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: "version",
      },
      parentId: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: "parentId",
      },
      status: {
        type: DataTypes.INTEGER(1),
        allowNull: true,
        field: "status",
      },
      lastVersionStatus: {
        type: DataTypes.INTEGER(1),
        allowNull: true,
        field: "lastVersionStatus",
      },
    },
    {
      tableName: "bids",
      timestamps: false,
    }
  );
};
