const express = require("express");
const router = express.Router();
const multer  = require('multer');

// const storageMulter = require("../../helpers/storage-multer.helper.js")

// Cấu hình thư mục khi lưu ở local (lưu ở máy)
// const upload = multer({ storage: storageMulter() });

// Cấu hình thư mục khi lưu ở cloud (lưu online)
const upload = multer();


const controller = require("../../controllers/admin/product.controller.js");
const validate = require("../../validates/admin/product.validate.js");

const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware.js")

// / <=> /admin/product/
router.get("/", controller.index);

// : key => để tạo ra 1 route động, lấy ra = req.params.key
router.patch("/change-status/:status/:id", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);

router.delete("/delete/:id", controller.deleteItem);

router.get("/create", controller.create);

// Khi vào route này thì sẽ cho vào validate.createPost trước rồi mới vào controller.createPost
router.post(
  "/create", 
  upload.single('thumbnail'),
  uploadCloud.uploadSingle,
  validate.createPost,
  controller.createPost
);

router.get("/edit/:id", controller.edit);

router.patch(
  "/edit/:id", 
  upload.single('thumbnail'),
  uploadCloud.uploadSingle, 
  validate.createPost,
  controller.editPatch
);

router.get("/detail/:id", controller.detail)


module.exports = router;