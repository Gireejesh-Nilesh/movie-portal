const express = require("express");
const {
  addFavorite,
  getFavorites,
  removeFavorite,
} = require("../../controllers/favorites/favorites.controller");
const { protect } = require("../../middlewares/auth.middleware");
const validate = require("../../middlewares/validate.middleware");
const {
  addFavoriteSchema,
  removeFavoriteSchema,
} = require("../../validators/favorites.validator");

const router = express.Router();

router.use(protect);

router.post("/", validate(addFavoriteSchema), addFavorite);
router.get("/", getFavorites);
router.delete("/:movieId", validate(removeFavoriteSchema), removeFavorite);

module.exports = router;
