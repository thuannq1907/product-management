const md5 = require('md5');
const Account = require("../../models/account.model.js");
const Role = require("../../models/role.model");

const generateHelper = require("../../helpers/generate.helper");

const systemConfig = require("../../config/system");

// [GET] /admin/accounts/
module.exports.index = async (req, res) => {
  // Find
  let find = {
    deleted: false,
  };
  // End Find

  const records = await Account.find(find);

  for (const record of records) {
    const role = await Role.findOne({
      _id: record.role_id
    });
    record.role = role;
  }

  res.render("admin/pages/accounts/index.pug", {
    pageTitle: "Danh sách tài khoản",
    records: records,
  });
};

// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
  const roles = await Role.find({
    deleted: false
  });

  console.log(roles);

  res.render("admin/pages/accounts/create.pug", {
    pageTitle: "Tạo mới tài khoản",
    roles: roles
  });
};

// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {

  req.body.token = generateHelper.generateRandomString(30);
  req.body.password = md5(req.body.password);

  const record = new Account(req.body);
  await record.save();

  res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
};