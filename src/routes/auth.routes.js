const express = require("express");

const authController = require("../controllers/auth.controller");

const router = express.Router();

router
  .route("/login")
  .get(authController.showLoginPage)
  .post(authController.login);

router
  .route("/register")
  .get(authController.showRegisterPage)
  .post(authController.signup);

router.route("/logout").get(authController.logout);

module.exports = router;
