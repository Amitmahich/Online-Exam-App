const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");
const {
  createExamController,
  addQuestionController,
  getExamController,
} = require("../controllers/examControllers");
const router = express.Router();
//create exam
router.post(
  "/create-exam",
  authMiddleware,
  authorizeRoles(["admin"]),
  createExamController,
);
//add questions
router.post(
  "/:exam_id/questions",
  authMiddleware,
  authorizeRoles(["admin"]),
  addQuestionController,
);
//get exam
router.get("/get-exam/:exam_id", authMiddleware, getExamController);
module.exports = router;
