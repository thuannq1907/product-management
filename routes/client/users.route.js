// file route chứa những route lquan đến tính năng kết bạn, đến các users khác
const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/users.controller");

router.get("/not-friend", controller.notFriend);

module.exports = router;