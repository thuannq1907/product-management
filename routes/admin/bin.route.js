const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/bin.controller.js");

router.get("/", controller.index);

router.patch("/recover/:id", controller.recover);

router.patch("/recover-multi", controller.recoverMulti);

router.delete("/delete-forever/:id", controller.deleteForever);

// router.delete("/delete-forever-multi", controller.recoverMulti);

module.exports = router;