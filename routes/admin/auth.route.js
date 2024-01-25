const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/auth.controller.js");

router.get("/login", controller.login);

router.post("/login", controller.loginPost);

router.get("/logout", controller.logout);

module.exports = router;