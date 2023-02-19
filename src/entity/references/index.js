export default (models) => {
  // eslint-disable-next-line no-empty-pattern
  const {
    biddingPartys,
    searchTerms,
    provinces,
    districts,
    fields,
    searchTermsFields,
    applyProcess,
  } = models;
  districts.belongsTo(provinces, {
    foreignKey: "provincesId",
    as: "provinces",
  });

  searchTerms.belongsTo(districts, {
    foreignKey: "districtsId",
    as: "districts",
  });
  searchTerms.belongsTo(provinces, {
    foreignKey: "provincesId",
    as: "provinces",
  });
  searchTerms.belongsTo(biddingPartys, {
    foreignKey: "biddingPartysSearch",
    as: "biddingPartys",
  });
  searchTerms.hasMany(searchTermsFields, {
    foreignKey: "searchTermsId",
    as: "searchTermsFields",
  });
  searchTermsFields.belongsTo(fields, {
    foreignKey: "fieldsId",
    as: "fields",
  });

  searchTerms.belongsTo(applyProcess, {
    foreignKey: "applyProcessId",
    as: "applyProcess",
  });
};
