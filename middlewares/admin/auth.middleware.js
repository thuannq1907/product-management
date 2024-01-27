const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
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
    }).select("-password");

    if(!user) {
      res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
      return;
    }

    const role = await Role.findOne({
      _id: user.role_id,
      deleted: false
    })

    res.locals.user = user;
    res.locals.role = role;
    // trả ra cho giao diện view 1 biến tên là user và role, nó <=> trả ra gtri ở phần res.render, res.locals thì mọi file pug có thể sd được

    next();
  } catch (error) {
    res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
  }
}