const Account = require("../../models/account.model");
const systemConfig = require("../../config/system");

module.exports.requireAuth = async (req, res, next) => {
  // console.log(req.cookies.token);
  if(!req.cookies.token){
    res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
    return;
  }

  try {
    const user = await Account.findOne({
      token: req.cookies.token,
      deleted: false,
      status: "active"
    });

    if(!user) {
      res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
      return;
    }

    next();
  } catch (error) {
    res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
  }
}