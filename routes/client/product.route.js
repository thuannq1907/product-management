const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/product.controller.js");


router.get("/", controller.index);

router.get("/detail", controller.detail);

router.get("/edit", controller.edit);

router.get("/create", controller.create);

module.exports = router;
