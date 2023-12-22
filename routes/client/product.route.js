// file route liên quan đến product

const express = require("express");
const router = express.Router();
// lúc này router nó là 1 hàm

const controller = require("../../controllers/client/product.controller.js");
// controller là 1 object



router.get("/", controller.index);
// router.get("/", (req, res) => {
//   res.render("client/pages/products/index.pug");
// });

router.get("/detail", controller.detail);

router.get("/edit", controller.edit);

router.get("/create", controller.create);

module.exports = router;
// export hàm router ra để file index.route.js còn dùng = cách require (import)