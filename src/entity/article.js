/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "article",
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "id",
      },
      title: {
        type: DataTypes.STRING(200),
        allowNull: false,
        field: "title",
      },
      shortDescription: {
        type: DataTypes.STRING(2000),
        allowNull: true,
        field: "shortDescription",
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "description",
      },
      image: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "image",
      },
      author: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: "author",
      },
      source: {
        type: DataTypes.STRING(1000),
        allowNull: true,
        field: "source",
      },
      tag: {
        type: DataTypes.STRING(300),
        allowNull: true,
        field: "tag",
      },
      seoKeywords: {
        type: DataTypes.STRING(200),
        allowNull: true,
        field: "seoKeywords",
      },
      seoDescriptions: {
        type: DataTypes.STRING(200),
        allowNull: true,
        field: "seoDescriptions",
      },
      seoDescriptions: {
        type: DataTypes.STRING(200),
        allowNull: false,
        field: "seoDescriptions",
      },
      categoriesId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: "categoriesId",
      },
      userCreatorsId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: "userCreatorsId",
      },

      createDate: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        field: "createDate",
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        field: "status",
      },
      urlSlugs: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: "urlSlugs",
      },
      languagesId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: "languagesId",
      },
    },
    {
      tableName: "article",
      timestamps: false,
    }
  );
};
