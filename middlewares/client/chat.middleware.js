const RoomChat = require("../../models/rooms-chat.model.js");

module.exports.isAccess = async (req, res, next) => {
  const roomChatId = req.params.roomChatId;
  const userId = res.locals.user.id;

  try {
    // tìm RoomChat và ktra xem trong RoomChat có id của user (tk đang đăng nhập) k
    const isAccessRoomChat = await RoomChat.findOne({
      _id: roomChatId,
      // cú pháp tìm user_id trong mảng users trong RoomChat
      "users.user_id": userId,
      deleted: false
    });

    if(isAccessRoomChat) {
      next();
    } else {
      res.redirect("/");
    }
  } catch (error) {
    res.redirect("/");
  }
}