const User = require("../../models/user.model");

module.exports.infoUser = async (req, res, next) => {
  // check token trên cookie, có thì trả ra t.tin user
  if(req.cookies.tokenUser) {
    const user = await User.findOne({
      tokenUser: req.cookies.tokenUser
    }).select("-password");

    if(user) {
      res.locals.user = user;
    }
  }

  // kể cả k đăng nhập vẫn phải next để ng k đăng nhập vẫn xem đc sp
  next();
}