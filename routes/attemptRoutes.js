const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  startExamController,
  submitExamController,
} = require("../controllers/attemptControllers");
const router = express.Router();
//start exam
router.post("/start-exam/:exam_id", authMiddleware, startExamController);
//submit exam
router.post("/submit-exam/:attempt_id", authMiddleware, submitExamController);
module.exports = router;
