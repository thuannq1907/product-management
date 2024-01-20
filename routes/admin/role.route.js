const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/role.controller.js");

// / <=> /admin/roles/
router.get("/", controller.index);

module.exports = router;