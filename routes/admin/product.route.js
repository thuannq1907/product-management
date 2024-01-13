const express = require("express");
const router = express.Router();
const multer  = require('multer');
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')

// Kết nối cloudinary vs project
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_KEY, 
  api_secret: process.env.CLOUD_SECRET, 
});
// End cloudinary


// const storageMulter = require("../../helpers/storage-multer.helper.js")

// Cấu hình thư mục khi lưu ở local (lưu ở máy)
// const upload = multer({ storage: storageMulter() });

// Cấu hình thư mục khi lưu ở cloud (lưu online)
const upload = multer();


const controller = require("../../controllers/admin/product.controller.js");
const validate = require("../../validates/admin/product.validate.js")

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
  function (req, res, next) {
    if(req.file){
      let streamUpload = (req) => {
        return new Promise((resolve, reject) => {
          let stream = cloudinary.uploader.upload_stream((error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          });
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };

      async function upload(req) {
          let result = await streamUpload(req);
          // console.log(result);
          // return là 1 object trả ra gtri lquan đến ảnh

          // 3 cách thêm link ảnh vào database, fieldname chính là nằm trong upload.single('thumbnail')
          // req.body.thumnail = result.url;
          // req.body['thumbnail'] = result.url;
          req.body[req.file.fieldname] = result.url;
          next();
      }
      upload(req);
    } else {
      next();
    }
  }, 
  validate.createPost,
  controller.createPost
);

router.get("/edit/:id", controller.edit);

router.patch(
  "/edit/:id", 
  upload.single('thumbnail'),
  function (req, res, next) {
    if(req.file){
      let streamUpload = (req) => {
        return new Promise((resolve, reject) => {
          let stream = cloudinary.uploader.upload_stream((error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          });
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };

      async function upload(req) {
          let result = await streamUpload(req);
          req.body[req.file.fieldname] = result.url;
          next();
      }
      upload(req);
    } else {
      next();
    }
  }, 
  validate.createPost,
  controller.editPatch
);

router.get("/detail/:id", controller.detail)


module.exports = router;