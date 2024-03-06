const User = require("../../models/user.model");

// [GET] /users/not-friend
module.exports.notFriend = async (req, res) => {
  const userId = res.locals.user.id;

  const users = await User.find({
    // ne: not equal => lấy những phần tử có id k = vs userId
    _id: { $ne: userId },
    status: "active",
    deleted: false
  }).select("id fullName avatar");
  // chỉ lấy những t.tin là id fullName avatar còn những t.tin còn lại k cần thiết

  res.render("client/pages/users/not-friend.pug", {
    pageTitle: "Danh sách người dùng",
    users: users
  });
};