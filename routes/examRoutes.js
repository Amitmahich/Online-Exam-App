const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");
const { createExamController } = require("../controllers/examControllers");
const router = express.Router();
router.post(
  "/create-exam",
  authMiddleware,
  authorizeRoles(["admin"]),
  createExamController,
);
module.exports = router;
