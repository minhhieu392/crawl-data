// NOTE ADD BY TRINH MINH HIEU

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "biddingPartys",
    {
      id: {
        type: DataTypes.BIGINT(10),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "id",
      },
      biddingPartysName: {
        type: DataTypes.STRING(500),
        allowNull: false,
        field: "biddingPartysName",
      },
      biddingPartysCode: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: "biddingPartysCode",
      },
    },
    {
      tableName: "biddingPartys",
      timestamps: false,
    }
  );
};
