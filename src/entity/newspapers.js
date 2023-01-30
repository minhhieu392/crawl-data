/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "newspapers",
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "id",
      },
      newspaperUrl: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        field: "newspaperUrl",
      },
      newspaperKeyword: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
        field: "newspaperKeyword",
      },
      userCreatorsId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: "userCreatorsId",
      },
      sitesId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: "sitesId",
      },
      categoriesId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: "categoriesId",
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "status",
      },
      dateCreated: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        field: "dateCreated",
      },
      dateUpdated: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        field: "dateUpdated",
      },
      lastTrackTime: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "lastTrackTime",
      },
    },
    {
      tableName: "newspapers",
      timestamps: false,
    }
  );
};
