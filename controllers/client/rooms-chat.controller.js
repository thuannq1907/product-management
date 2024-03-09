const User = require("../../models/user.model.js");
const RoomChat = require("../../models/rooms-chat.model.js");

// [GET] /rooms-chat/
module.exports.index = async (req, res) => {
  const userId = res.locals.user.id;

  // hiển thị tất cả danh sách phòng chat của user (tk đang đăng nhập)
  const listRoomChat = await RoomChat.find({
    // những phòng mà có id của A bên trong
    "users.user_id": userId,
    typeRoom: "group",
    deleted: false
  });


  res.render("client/pages/rooms-chat/index.pug", {
    pageTitle: "Danh sách phòng",
    listRoomChat: listRoomChat
  });
};

// [GET] /rooms-chat/create
module.exports.create = async (req, res) => {
  const friendsList = res.locals.user.friendsList;

  // Danh sách những user đã kb với A (để thêm vào đoạn chat)
  for (const friend of friendsList) {
    const infoFriend = await User.findOne({
      _id: friend.user_id
    }).select("fullName avatar");

    // từ id của bạn bè trong friendsList => lấy ra được thêm fullName và avatar trong User rồi add vào từng user trong friendsList đó
    friend.infoFriend = infoFriend;
  }

  res.render("client/pages/rooms-chat/create.pug", {
    pageTitle: "Tạo phòng",
    friendsList: friendsList
  });
};

// [POST] /rooms-chat/create
module.exports.createPost = async (req, res) => {
  const title = req.body.title;
  // lấy ra 1 mảng các id user (được chọn để thêm vào đoạn chat)
  const usersId = req.body.usersId;
  
  // tạo mới phòng chat (dựa vào model RoomChat)
  const dataRoom = {
    title: title,
    typeRoom: "group",
    users: []
  };

  // vì mình (tk đang đăng nhập) tạo phòng chat => add mình vào đầu tiên vs role cao nhất
  dataRoom.users.push({
    user_id: res.locals.user.id,
    role: "superAdmin"
  });

  // lặp qua từng user trong mảng usersId và add vào đoạn chat
  usersId.forEach(userId => {
    dataRoom.users.push({
      user_id: userId,
      role: "user"
    });
  });

  // lưu phòng chat vào database
  const roomChat = new RoomChat(dataRoom);
  await roomChat.save();

  res.redirect(`/chat/${roomChat.id}`);
};