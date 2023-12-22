// file route liên quan đến product
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("client/pages/products/index.pug");
});

// router.get("/detail", (req, res) => {
//   res.send("Trang chi tiết sản phẩm");
// });

// router.get("/edit", (req, res) => {
  
// });

// router.get("/create", (req, res) => {
  
// });

module.exports = router;
// Sau khi định nghĩa xong những router cụ thể rồi thì export nó ra