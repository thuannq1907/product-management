const Product = require("../../models/product.model.js")
// [GET] /admin/product/
module.exports.index = async (req, res) => {
  const products = await Product.find({
    delete: false
  });

  res.render("admin/pages/products/index.pug", {
    pageTitle: "Trang danh sách sản phẩm",
    products: products
  });
}