const md5 = require("md5");
const Account = require("../../models/account.model");

// Làm trang Thông tin cá nhân bên admin (Hiển thị thông tin)
// [GET] /admin/my-account/
module.exports.index = async (req, res) => {
  res.render("admin/pages/my-account/index.pug", {
    pageTitle: "Thông tin cá nhân",
  });
};

// [GET] /admin/my-account/edit
module.exports.edit = async (req, res) => {
  res.render("admin/pages/my-account/edit.pug", {
    pageTitle: "Chỉnh sửa thông tin cá nhân",
  });
};

// [PATCH] /admin/my-account/edit
module.exports.editPatch = async (req, res) => {
  if(req.body.password){
    req.body.password = md5(req.body.password); 
  } else {
    delete req.body.password
  }

  await Account.updateOne({
    _id: res.locals.user.id
  }, req.body);

  res.redirect("back");
};