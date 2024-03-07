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
  const friendsListId = res.locals.user.friendsList.map(item => item.user_id);
  // vì friendsListId là 1 mảng object => sd map để lặp lấy hết id
  // => lúc này friendsListId là 1 mảng các id chứ k còn là 1 mảng các object nữa

  const users = await User.find({
    // tìm những phần tử có id khác vs userId (id của chúng ta), k có trong cả requestFriends và acceptFriends
    // kết hợp nhiều điều kiện 
    $and: [
      // not equal => những id khác userId
      { _id: { $ne: userId } },
      // not in => tìm những id không tồn tại trong mảng
      { _id: { $nin: requestFriends } },
      { _id: { $nin: acceptFriends } },
      { _id: { $nin: friendsListId } }
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

// [GET] /users/accept
module.exports.accept = async (req, res) => {
  // SocketIO
  usersSocket(res);
  // End SocketIO

  const acceptFriends = res.locals.user.acceptFriends;

  // lấy ra các user trong acceptFriends
  const users = await User.find({
    _id: { $in: acceptFriends },
    status: "active",
    deleted: false
  }).select("id fullName avatar");

  res.render("client/pages/users/accept.pug", {
    pageTitle: "Lời mời đã nhận",
    users: users
  });
};

// [GET] /users/friends
module.exports.friends = async (req, res) => {
  const friendsListId = res.locals.user.friendsList.map(item => item.user_id);
  // 1 mảng các id trong friendsListId

  const users = await User.find({
    // tìm tất cả id có trong friendsListId
    _id: { $in: friendsListId },
    status: "active",
    deleted: false
  }).select("id fullName avatar statusOnline");

  res.render("client/pages/users/friends.pug", {
    pageTitle: "Danh sách bạn bè",
    users: users
  });
};