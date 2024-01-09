const express = require("express");
const router = express.Router();
const multer  = require('multer');

const storageMulter = require("../../helpers/storage-multer.helper.js")

const upload = multer({ storage: storageMulter() });


const controller = require("../../controllers/admin/product.controller.js");

// / <=> /admin/product/
router.get("/", controller.index);

// : key => để tạo ra 1 route động, lấy ra = req.params.key
router.patch("/change-status/:status/:id", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);

router.delete("/delete/:id", controller.deleteItem);

router.get("/create", controller.create);

router.post("/create", upload.single('thumbnail'), controller.createPost);

module.exports = router;