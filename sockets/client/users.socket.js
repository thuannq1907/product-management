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
    })
  });
}