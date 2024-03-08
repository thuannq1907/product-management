const RoomChat = require("../../models/rooms-chat.model.js");
const User = require("../../models/user.model");

module.exports = (res) => {
  _io.once("connection", (socket) => {
    // Khi A gửi yêu cầu cho B
    socket.on("CLIENT_ADD_FRIEND", async (userIdB) => {
      const userIdA = res.locals.user.id;

      // Thêm id của A vào acceptFriends của B

      // ktra xem trong acceptFriends của B có id của A chưa, chưa thì add, rồi thì thôi
      const existUserAInB = await User.findOne({
        _id: userIdB,
        acceptFriends: userIdA
      })

      if(!existUserAInB){
        await User.updateOne({
          _id: userIdB
        }, {
          // push phần tử userIdA vào mảng acceptFriends của userIdB
          $push: { acceptFriends: userIdA }
        })
      }


      // Thêm id của B vào requestFriends của A
      
      // ktra xem trong requestFriends của A có id của B chưa, chưa thì add, rồi thì thôi
      const existUserBInA = await User.findOne({
        _id: userIdA,
        requestFriends: userIdB
      })

      if(!existUserBInA){
        await User.updateOne({
          _id: userIdA
        }, {
          // push phần tử userIdB vào mảng requestFriends của userIdA
          $push: { requestFriends: userIdB }
        })
      }

      // Lấy độ dài acceptFriends của B để trả về cho B
      const infoUserB = await User.findOne({
        _id: userIdB
      }).select("acceptFriends");

      const lengthAcceptFriendsB = infoUserB.acceptFriends.length;

      socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
        userId: userIdB,
        lengthAcceptFriends: lengthAcceptFriendsB
      });

      // Lấy thông tin của A để trả về cho B để in ra bên phần lời mời kb của B (real time)
      const infoUserA = await User.findOne({
        _id: userIdA
      }).select("id fullName avatar");

      socket.broadcast.emit("SERVER_RETURN_INFO_ACCEPT_FRIEND", {
        userIdB: userIdB,
        infoUserA: infoUserA
      });


    })

    // Khi A hủy gửi yêu cầu cho B
    socket.on("CLIENT_CANCEL_FRIEND", async (userIdB) => {
      const userIdA = res.locals.user.id;

      // Xóa id của A khỏi acceptFriends của B
      await User.updateOne({
        _id: userIdB
      }, {
        // pull phần tử userIdA khỏi mảng acceptFriends của userIdB
        $pull: { acceptFriends: userIdA }
      })


      // Xóa id của B khỏi requestFriends của A
      await User.updateOne({
        _id: userIdA
      }, {
        // pull phần tử userIdB khỏi mảng requestFriends của userIdA
        $pull: { requestFriends: userIdB }
      })

      // Lấy độ dài acceptFriends của B để trả về cho B
      const infoUserB = await User.findOne({
        _id: userIdB
      }).select("acceptFriends");

      const lengthAcceptFriendsB = infoUserB.acceptFriends.length;

      socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
        userId: userIdB,
        lengthAcceptFriends: lengthAcceptFriendsB
      });

      // Lấy userId của A trả về cho B để B xóa A khỏi danh sách Lời mời kết bạn
      socket.broadcast.emit("SERVER_RETURN_ID_CANCEL_FRIEND", {
        userIdB: userIdB,
        userIdA: userIdA
      });
    })

    // Khi B từ chối kết bạn của A
    socket.on("CLIENT_REFUSE_FRIEND", async (userIdA) => {
      const userIdB = res.locals.user.id;

      // Xóa id của A khỏi acceptFriends của B
      await User.updateOne({
        _id: userIdB
      }, {
        // pull phần tử userIdA khỏi mảng acceptFriends của userIdB
        $pull: { acceptFriends: userIdA }
      })


      // Xóa id của B khỏi requestFriends của A
      await User.updateOne({
        _id: userIdA
      }, {
        // pull phần tử userIdB khỏi mảng requestFriends của userIdA
        $pull: { requestFriends: userIdB }
      })
    })

    // Khi B chấp nhận kết bạn của A
    socket.on("CLIENT_ACCEPT_FRIEND", async (userIdA) => {
      const userIdB = res.locals.user.id;

      // Tạo phòng chat mới giữa A và B (2 người)
      const roomChat = new RoomChat({
        typeRoom: "friend",
        users: [
          {
            user_id: userIdA,
            role: "superAdmin"
          },
          {
            user_id: userIdB,
            role: "superAdmin"
          }
        ],
      });

      await roomChat.save();

      // Thêm {user_id, room_chat_id} của A vào friendsList của B
      // Xóa id của A trong acceptFriends của B
      await User.updateOne({
        _id: userIdB
      }, {
        // push vào friendsList của B 1 object gồm id của user và room_chat của A
        $push: {
          friendsList: {
            user_id: userIdA,
            room_chat_id: roomChat.id
          }
        },
        // pull phần tử userIdA khỏi mảng acceptFriends của userIdB
        $pull: { acceptFriends: userIdA }
      });


      // Thêm {user_id, room_chat_id} của B vào friendsList của A
      // Xóa id của B trong requestFriends của A
      await User.updateOne({
        _id: userIdA
      }, {
        // push vào friendsList của A 1 object gồm id của user và room_chat của B
        $push: {
          friendsList: {
            user_id: userIdB,
            room_chat_id: roomChat.id
          }
        },
        // pull phần tử userIdB khỏi mảng requestFriends của userIdA
        $pull: { requestFriends: userIdB }
      });
    })
  });
}