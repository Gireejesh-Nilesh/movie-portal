const express = require("express");
const validate = require("../../middlewares/validate.middleware");
const { search } = require("../../controllers/movies/search.controller");
const { searchSchema } = require("../../validators/tmdb.validator");

const router = express.Router();

router.get("/", validate(searchSchema), search);

module.exports = router;
