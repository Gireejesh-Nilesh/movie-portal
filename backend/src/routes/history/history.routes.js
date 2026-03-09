const express = require("express");
const {
  addOrUpdateHistory,
  getHistory,
  removeHistoryItem,
  clearHistory,
} = require("../../controllers/history/history.controller");
const { protect } = require("../../middlewares/auth.middleware");
const validate = require("../../middlewares/validate.middleware");
const {
  addOrUpdateHistorySchema,
  getHistorySchema,
  removeHistorySchema,
} = require("../../validators/history.validator");

const router = express.Router();

router.use(protect);

router.post("/", validate(addOrUpdateHistorySchema), addOrUpdateHistory);
router.get("/", validate(getHistorySchema), getHistory);
router.delete("/:movieId", validate(removeHistorySchema), removeHistoryItem);
router.delete("/", clearHistory);

module.exports = router;
