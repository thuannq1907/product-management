const categoryProduct = require("../../models/product-category.model");
const Product = require("../../models/product.model");
const account = require("../../models/account.model");
const user = require("../../models/user.model");
// [GET] /admin/dashboard/
module.exports.index = async (req, res) => {
  const statistic = {
    categoryProduct: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    product: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    account: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    user: {
      total: 0,
      active: 0,
      inactive: 0,
    },
  };

  // categoryProduct
  // đếm ở trạng thái total
  statistic.categoryProduct.total = await categoryProduct.countDocuments({
    deleted: false
  });

  // đếm ở trạng thái active
  statistic.categoryProduct.active = await categoryProduct.countDocuments({
    status: "active",
    deleted: false
  });

  // đếm ở trạng thái inactive
  statistic.categoryProduct.inactive = await categoryProduct.countDocuments({
    status: "inactive",
    deleted: false
  });
  // End categoryProduct


  // Product
  statistic.product.total = await Product.countDocuments({
    deleted: false
  });
  statistic.product.active = await Product.countDocuments({
    status: "active",
    deleted: false
  });
  statistic.product.inactive = await Product.countDocuments({
    status: "inactive",
    deleted: false
  });
  // End Product

  
  // account
  statistic.account.total = await account.countDocuments({
    deleted: false
  });
  statistic.account.active = await account.countDocuments({
    status: "active",
    deleted: false
  });
  statistic.account.inactive = await account.countDocuments({
    status: "inactive",
    deleted: false
  });
  // End account


  // user
  statistic.user.total = await user.countDocuments({
    deleted: false
  });
  statistic.user.active = await user.countDocuments({
    status: "active",
    deleted: false
  });
  statistic.user.inactive = await user.countDocuments({
    status: "inactive",
    deleted: false
  });
  // End user

  res.render("admin/pages/dashboard/index.pug", {
    pageTitle: "Trang tổng quan",
    statistic: statistic
  });
}