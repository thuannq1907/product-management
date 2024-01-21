const express = require("express");
const router = express.Router();
const multer = require("multer");

const upload = multer();

const controller = require("../../controllers/admin/account.controller.js");

const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

router.get("/", controller.index);

router.get("/create", controller.create);

router.post(
  "/create",
  upload.single("avatar"),
  uploadCloud.uploadSingle,
  controller.createPost
);

module.exports = router;