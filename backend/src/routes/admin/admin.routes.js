const express = require("express");
const {
  addMovie,
  getMovies,
  updateMovie,
  deleteMovie,
} = require("../../controllers/admin/admin-movies.controller");
const {
  getUsers,
  banUser,
  deleteUser,
} = require("../../controllers/admin/admin-users.controller");
const { protect, authorizeRoles } = require("../../middlewares/auth.middleware");
const validate = require("../../middlewares/validate.middleware");
const {
  createAdminMovieSchema,
  updateAdminMovieSchema,
  adminMovieIdParamSchema,
  adminUserIdParamSchema,
  adminBanUserSchema,
} = require("../../validators/admin.validator");

const router = express.Router();

router.use(protect);
router.use(authorizeRoles("admin"));

router.post("/movies", validate(createAdminMovieSchema), addMovie);
router.get("/movies", getMovies);
router.put("/movies/:id", validate(updateAdminMovieSchema), updateMovie);
router.delete("/movies/:id", validate(adminMovieIdParamSchema), deleteMovie);

router.get("/users", getUsers);
router.patch("/users/:id/ban", validate(adminBanUserSchema), banUser);
router.delete("/users/:id", validate(adminUserIdParamSchema), deleteUser);

module.exports = router;
