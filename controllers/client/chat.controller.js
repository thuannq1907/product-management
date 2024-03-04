const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");
const uploadToCloudinary = require("../../helpers/upload-to-cloudinary.helper");

// [GET] /chat/
module.exports.index = async (req, res) => {
  const userId = res.locals.user.id;
  const fullName = res.locals.user.fullName;

  // SocketIO
  // _io.on: load lại trang thì sẽ khởi tạo lại và sẽ lưu thêm vào db
  // _io.once: load lại trang thì sẽ k lưu thêm vào db, chỉ lưu 1 lần duy nhất
  _io.once("connection", (socket) => {
    // Người dùng gửi tin nhắn lên server
    socket.on("CLIENT_SEND_MESSAGE", async (data) => {
      const images = [];

      for (const image of data.images) {
        const url = await uploadToCloudinary(image);
        images.push(url);
      }

      const chat = new Chat({
        user_id: userId,
        content: data.content,
        images: images
      });

      await chat.save();

      // Trả data ra giao diện realtime
      _io.emit("SERVER_SEND_MESSAGE", {
        userId: userId,
        fullName: fullName,
        content: data.content,
        images: images
      });
    });


    // Typing
    // bắt sự kiện CLIENT_SEND_TYPING (khi ng dùng nhập bàn phím)
    socket.on("CLIENT_SEND_TYPING", (type) => {
      // phát ra cho những ng khác nhận
      socket.broadcast.emit("SERVER_RETURN_TYPING", {
        userId: userId,
        fullName: fullName,
        type: type
      })
    })

  });
  // End SocketIO

    // Lấy data từ database
    // tìm tất cả tin nhắn trong db
    const chats = await Chat.find({
      // 1 mảng các tin nhắn
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