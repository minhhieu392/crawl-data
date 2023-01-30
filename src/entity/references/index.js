export default (models) => {
  // eslint-disable-next-line no-empty-pattern
  const { newspapers, news, newsUrlSlugs } = models;

  // Users.hasMany(Roles, { foreignKey: 'UserId', as: 'RoleDetails' })
  // Người dùng
  news.belongsTo(newspapers, {
    foreignKey: "newspapersId",
    as: "newspapers",
  });

  news.hasMany(newsUrlSlugs, {
    foreignKey: "newsId",
    as: "newsUrlSlugs",
  });
  newsUrlSlugs.belongsTo(news, {
    foreignKey: "newsId",
    as: "news",
  });
};
