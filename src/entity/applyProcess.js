// NOTE ADD BY TRINH MINH HIEU

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "applyProcess",
    {
      id: {
        type: DataTypes.BIGINT(10),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "id",
      },
      applyProcessName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: "applyProcessName",
      },

      codeValue: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: "codeValue",
      },
    },
    {
      tableName: "applyProcess",
      timestamps: false,
    }
  );
};
