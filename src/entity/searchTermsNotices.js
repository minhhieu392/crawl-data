module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "searchTermsNotices",
    {
      id: {
        type: DataTypes.BIGINT(10),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "id",
      },
      searchTermsId: {
        type: DataTypes.BIGINT(20),
        allowNull: true,
        field: "searchTermsId",
      },
      zaloId: {
        type: DataTypes.JSON,
        allowNull: true,
        field: "zaloId",
      },
      facebookId: {
        type: DataTypes.JSON,
        allowNull: true,
        field: "facebookId",
      },
      slackId: {
        type: DataTypes.JSON,
        allowNull: true,
        field: "slackId",
      },
      telegramId: {
        type: DataTypes.JSON,
        allowNull: true,
        field: "telegramId",
      },
      email: {
        type: DataTypes.JSON,
        allowNull: true,
        field: "email",
      },
    },
    {
      tableName: "searchTermsNotices",
      timestamps: false,
    }
  );
};
