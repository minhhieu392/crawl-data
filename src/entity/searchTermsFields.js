// NOTE ADD BY TRINH MINH HIEU

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "searchTermsFields",
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
      fieldsId: {
        type: DataTypes.BIGINT(20),
        allowNull: true,
        field: "fieldsId",
      },
    },
    {
      tableName: "searchTermsFields",
      timestamps: false,
    }
  );
};
