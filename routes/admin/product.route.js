const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/product.controller.js");

// / <=> /admin/product/
router.get("/", controller.index);

// : key => để tạo ra 1 route động, lấy ra = req.params.key
router.patch("/change-status/:status/:id", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);

module.exports = router;