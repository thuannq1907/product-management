const User = require("../../models/user.model");

module.exports = (res) => {
  _io.once("connection", (socket) => {
    // Người dùng gửi yêu cầu kết bạn
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
    })
  });
}