module.exports = async ({ reqQuery, filter, Model, queryLimit }) => {
  const totalFilteredQuery = await Model.countDocuments(filter);

  const page = Number(reqQuery.page || 1);
  const limit = queryLimit;
  const skip = (page - 1) * limit;
  const totalPages = Math.ceil(totalFilteredQuery / limit);

  return { page, totalPages, skip, limit, totalFilteredQuery };
};
