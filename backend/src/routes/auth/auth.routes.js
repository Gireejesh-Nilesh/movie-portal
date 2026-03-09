const express = require("express");
const {
  signup,
  login,
  logout,
  getCurrentUser,
} = require("../../controllers/auth/auth.controller");
const { protect } = require("../../middlewares/auth.middleware");
const validate = require("../../middlewares/validate.middleware");
const { signupSchema, loginSchema } = require("../../validators/auth.validator");

const router = express.Router();

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.get("/me", protect, getCurrentUser);

module.exports = router;
