const User = require("../../models/user.model");

// vì /user/info là route sau khi đăng nhập nên phải thêm middleware vào để check xem user đăng nhập chưa, nếu k có thì route này ai cx có thể truy cập
module.exports.requireAuth = async (req, res, next) => {
  if(!req.cookies.tokenUser) {
    res.redirect("/user/login");
  } else {
    const user = await User.findOne({
      tokenUser: req.cookies.tokenUser,
      deleted: false,
    }).select("-password");

    if(!user) {
      res.redirect("/user/login");
    } else {
      res.locals.infoUser = user;

      next();
    }
  }
}