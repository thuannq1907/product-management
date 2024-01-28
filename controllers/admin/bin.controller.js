const Product = require("../../models/product.model.js")
const Account = require("../../models/account.model.js");
const filterStateHelper = require("../../helpers/filter-state.helper.js");
const paginationHelper = require("../../helpers/pagination.helper.js");
const systemConfig = require("../../config/system.js");

module.exports.index = async (req, res) => {
  const find = {
    deleted: true
  }
  const products = await Product.find(find);
  
  for (const product of products) {
    const account = await Account.findOne({
      _id: product.deletedBy.accountId
    });
    
    if(account) {
      product.deletedBy.fullName = account.fullName;
    }
  }

  res.render("admin/pages/bin/index.pug", {
    pageTitle: "Sản phẩm đã xóa",
    products: products
  })
}

module.exports.recover = async (req, res) => {
  const id = req.params.id;
  await Product.updateOne({
    _id: id
  } , {
    deleted: false
  })

  req.flash('success', 'Khôi phục thành công');
  
  res.redirect("back");
}

module.exports.recoverMulti = async (req, res) => {
  try {
    const type = req.body.type;
    const idRecover = req.body.idRecover.split(", ");
    switch (type) {
      case "recover-all":
        await Product.updateMany({
          _id: {$in: idRecover}
        } , {
          deleted: false
        })
  
        req.flash('success', 'Khôi phục thành công');
        break;
      case "delete-all-forever":
        await Product.deleteMany({
          _id: {$in: idRecover}
        })

        req.flash('success', 'Xóa vĩnh viễn thành công');
        break;
      default:
        break;
    }
  } catch (error) {
    console.log(error);
  }
  res.redirect("back");
}

module.exports.deleteForever = async (req, res) => {
  const id = req.params.id;

  await Product.deleteOne({
    _id: id
  })

  res.redirect("back");

}

