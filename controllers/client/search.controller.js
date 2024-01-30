const Product = require("../../models/product.model");

// [GET] /search/
module.exports.index = async (req, res) => {
  const keyword = req.query.keyword;

  let products = [];

  if(keyword) {
    const keywordRegex = new RegExp(keyword, "i");
    // "i" là không phân biệt chữ hoa chữ thường, cứ có sp có chữ keyword là lấy hết

    products = await Product.find({
      title: keywordRegex,
      status: "active",
      deleted: false
    }).sort({ position: "desc" });
  }

  res.render("client/pages/search/index.pug", {
    pageTitle: "Kết quả tìm kiếm",
    keyword: keyword,
    products: products
  });
};