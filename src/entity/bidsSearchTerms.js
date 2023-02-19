// NOTE ADD BY TRINH MINH HIEU

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "bidsSearchTerms",
    {
      id: {
        type: DataTypes.BIGINT(10),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "id",
      },
      bidsId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: "bidsId",
      },
      searchTermsId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: "searchTermsId",
      },
    },
    {
      tableName: "bidsSearchTerms",
      timestamps: false,
    }
  );
};
