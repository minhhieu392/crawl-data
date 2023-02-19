// NOTE ADD BY TRINH MINH HIEU

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "fields",
    {
      id: {
        type: DataTypes.BIGINT(10),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "id",
      },
      fieldsName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: "fieldsName",
      },
      status: {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: "status",
      },
      codeValue: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: "codeValue",
      },
    },
    {
      tableName: "fields",
      timestamps: false,
    }
  );
};
