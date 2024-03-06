const User = require("../../models/user.model");

const usersSocket = require("../../sockets/client/users.socket");

// [GET] /users/not-friend
module.exports.notFriend = async (req, res) => {
  // SocketIO
  usersSocket(res);
  // End SocketIO

  const userId = res.locals.user.id;

  const requestFriends = res.locals.user.requestFriends;
  const acceptFriends = res.locals.user.acceptFriends;

  const users = await User.find({
    // tìm những phần tử có id khác vs userId (id của chúng ta), k có trong cả requestFriends và acceptFriends
    // kết hợp nhiều điều kiện 
    $and: [
      // not equal => những id khác userId
      { _id: { $ne: userId } },
      // not in => tìm những id không tồn tại trong mảng
      { _id: { $nin: requestFriends } },
      { _id: { $nin: acceptFriends } }
    ],
    status: "active",
    deleted: false
  }).select("id fullName avatar");
  // chỉ lấy những t.tin là id fullName avatar còn những t.tin còn lại k cần thiết

  res.render("client/pages/users/not-friend.pug", {
    pageTitle: "Danh sách người dùng",
    users: users
  });
};

// [GET] /users/request
module.exports.request = async (req, res) => {
  // SocketIO
  usersSocket(res);
  // End SocketIO

  // 1 mảng lưu những ng mà chúng ta đã gửi yêu cầu
  const requestFriends = res.locals.user.requestFriends;

  const users = await User.find({
    // tìm tất cả những id có trong mảng requestFriends rồi in ra
    _id: { $in: requestFriends },
    status: "active",
    deleted: false
  }).select("id fullName avatar");

  // console.log(users);

  res.render("client/pages/users/request.pug", {
    pageTitle: "Lời mời đã gửi",
    users: users
  });
};