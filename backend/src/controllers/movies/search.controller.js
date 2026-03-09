const asyncHandler = require("../../utils/async-handler");
const tmdbService = require("../../services/tmdb/tmdb.service");

const search = asyncHandler(async (req, res) => {
  const { q, page } = req.query;
  const data = await tmdbService.searchMulti({ query: q, page });

  return res.status(200).json({
    success: true,
    query: q,
    ...data,
  });
});

module.exports = {
  search,
};
