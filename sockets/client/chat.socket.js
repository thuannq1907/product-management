const Chat = require("../../models/chat.model");
const uploadToCloudinary = require("../../helpers/upload-to-cloudinary.helper");

module.exports = (res) => {
  const userId = res.locals.user.id;
  const fullName = res.locals.user.fullName;
  
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
}