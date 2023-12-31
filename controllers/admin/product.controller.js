const Product = require("../../models/product.model.js")
const filterStateHelper = require("../../helpers/filter-state.helper.js")

// [GET] /admin/product/
module.exports.index = async (req, res) => {

  // Status Filter
  const filterState = filterStateHelper(req.query);
  // End Status Filter

  const find = {
    deleted: false
  }

  
  if(req.query.status) {
    find.status = req.query.status;
  }


  // Search
  if(req.query.keyword) {
    const regex = new RegExp(req.query.keyword, "i")
    // "i" : so khớp k quan tâm đến chữ hoa chữ thường
    find.title = regex;
  }
  // End Search

  const products = await Product.find(find);

  res.render("admin/pages/products/index.pug", {
    pageTitle: "Trang danh sách sản phẩm",
    products: products,
    filterState: filterState,
    keyword: req.query.keyword
  });
}