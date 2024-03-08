const Chat = require("../../models/chat.model");
const uploadToCloudinary = require("../../helpers/upload-to-cloudinary.helper");

module.exports = (req, res) => {
  const userId = res.locals.user.id;
  const fullName = res.locals.user.fullName;
  const roomChatId = req.params.roomChatId;
  // lưu roomChatId vào từng tin nhắn
  
  // _io.on: load lại trang thì sẽ khởi tạo lại và sẽ lưu thêm vào db
  // _io.once: load lại trang thì sẽ k lưu thêm vào db, chỉ lưu 1 lần duy nhất
  _io.once("connection", (socket) => {
    socket.join(roomChatId);

    // Người dùng gửi tin nhắn lên server
    socket.on("CLIENT_SEND_MESSAGE", async (data) => {
      const images = [];

      for (const image of data.images) {
        const url = await uploadToCloudinary(image);
        images.push(url);
      }

      const chat = new Chat({
        user_id: userId,
        room_chat_id: roomChatId,
        content: data.content,
        images: images
      });

      await chat.save();

      // Trả data ra giao diện realtime
      // to(roomChatId) => chỉ đẩy tin nhắn về phòng có id là roomChatId chứ k đẩy về tất cả các phòng
      _io.to(roomChatId).emit("SERVER_SEND_MESSAGE", {
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
      socket.broadcast.to(roomChatId).emit("SERVER_RETURN_TYPING", {
        userId: userId,
        fullName: fullName,
        type: type
      })
    })

  });
}