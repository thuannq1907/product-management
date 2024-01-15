const express = require("express");
const router = express.Router();
const multer = require("multer");

const upload = multer();

const controller = require("../../controllers/admin/products-category.controller.js");

const validate = require("../../validates/admin/product-category.validate.js");

const uploadCloud = require("../../middleware/admin/uploadCloud.middleware.js");

router.get("/", controller.index);

router.get("/create", controller.create);

router.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloud.uploadSinger,
  validate.createPost,
  controller.createPost
);

module.exports = router;