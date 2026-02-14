const express = require("express");
const {
  registerController,
  loginController,
} = require("../controllers/authControllers");
const router = express.Router();
//register
router.post("/register", registerController);
//login
router.post("/login", loginController);
module.exports = router;
