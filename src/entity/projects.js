module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "projects",
    {
      id: {
        type: DataTypes.BIGINT(10),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "id",
      },
      khlcntCode: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: "khlcntCode",
      },
      khlcntName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        field: "khlcntName",
      },
      projectsName: {
        type: DataTypes.STRING(500),
        allowNull: false,
        field: "projectsName",
      },
      biddingPartysId: {
        type: DataTypes.BIGINT(20),
        allowNull: false,
        field: "biddingPartysId",
      },
      money: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        field: "money",
      },
      moneyString: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: "moneyString",
      },
      approvalDecisionsNumber: {
        type: DataTypes.STRING(200),
        allowNull: true,
        field: "approvalDecisionsNumber",
      },
      approvalDecisionsDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "approvalDecisionsDate",
      },
      approvalDecisionsAgencies: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: "approvalDecisionsAgencies",
      },
      approvalDecisionsFile: {
        type: DataTypes.JSON,
        allowNull: true,
        field: "approvalDecisionsFile",
      },
      projectsTypeName: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: "projectsTypeName",
      },
      investorsId: {
        type: DataTypes.BIGINT(20),
        allowNull: true,
        field: "investorsId",
      },
      url: {
        type: DataTypes.STRING(1000),
        allowNull: true,
        field: "url",
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
    },
    {
      tableName: "projects",
      timestamps: false,
    }
  );
};
