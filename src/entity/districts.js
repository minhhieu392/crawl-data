/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "districts",
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "id",
      },
      districtsName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        field: "districtsName",
      },
      provincesId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: "provincesId",
      },
      userCreatorsId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: "userCreatorsId",
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

      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "status",
      },
      codeValue: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: "codeValue",
      },
    },
    {
      tableName: "districts",
      timestamps: false,
    }
  );
};
