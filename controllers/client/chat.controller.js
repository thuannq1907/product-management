const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");

const chatSocket = require("../../sockets/client/chat.socket");

// [GET] /chat/
module.exports.index = async (req, res) => {

  // SocketIO
  chatSocket(res);
  // End SocketIO

  // Lấy data từ database
  const chats = await Chat.find({
    deleted: false
  });

  // ktra, chỉ lấy ra những tin nhắn do tk đã đăng nhập này gửi
  for (const chat of chats) {
    const infoUser = await User.findOne({
      _id: chat.user_id
    }).select("fullName");

    chat.infoUser = infoUser;
    // chat là 1 object bao gồm content, user_id và infoUser (sau khi add thêm)
  }

  // Hết Lấy data từ database

  res.render("client/pages/chat/index", {
    pageTitle: "Chat",
    chats: chats
  });
};