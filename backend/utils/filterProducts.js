const caseInsensitiveFilter = (filter, reqQuery, field) => {
  const match = reqQuery[field].replaceAll("-", " ");
  filter[field] = {
    $regex: `^${match}$`,
    $options: "i",
  };
};

module.exports = (reqQuery) => {
  const filter = { ...reqQuery };
  const excludedFields = ["page", "sort", "limit", "minPrice", "maxPrice"];

  excludedFields.forEach((field) => delete filter[field]);

  if (reqQuery.minPrice || reqQuery.maxPrice) {
    filter.price = {};
    reqQuery.minPrice && (filter.price.$gte = Number(reqQuery.minPrice));
    reqQuery.maxPrice && (filter.price.$lte = Number(reqQuery.maxPrice));
  }

  reqQuery.category && caseInsensitiveFilter(filter, reqQuery, "category");
  reqQuery.brand && caseInsensitiveFilter(filter, reqQuery, "brand");

  const filterString = JSON.stringify(filter).replace(
    /"(?:(gte|gt|lte|lt))"\s*:/g,
    '"$$$1":'
  );

  return JSON.parse(filterString);
};
