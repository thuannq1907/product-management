// Gửi yêu cầu kết bạn
const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]");
if(listBtnAddFriend.length > 0) {
  listBtnAddFriend.forEach(button => {
    button.addEventListener("click", () => {
      // từ nút btn-add-friend thì truy vấn ra thẻ cha là box-user để add thêm thẻ add vào
      // hàm closet() => tìm thẻ cha = cách truyền class của thẻ cha đó vào
      button.closest(".box-user").classList.add("add");

      const userId = button.getAttribute("btn-add-friend");

      // khi nhấn vào nút kb thì gửi id lên server để lưu vào database
      socket.emit("CLIENT_ADD_FRIEND", userId);
    });
  });
}
// Hết Gửi yêu cầu kết bạn


// Hủy gửi yêu cầu kết bạn
const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]");
if(listBtnCancelFriend.length > 0) {
  listBtnCancelFriend.forEach(button => {
    button.addEventListener("click", () => {
      button.closest(".box-user").classList.remove("add");

      const userId = button.getAttribute("btn-cancel-friend");

      socket.emit("CLIENT_CANCEL_FRIEND", userId);
    });
  });
}
// Hết Hủy gửi yêu cầu kết bạn


// Từ chối kết bạn
const listBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]");
if(listBtnRefuseFriend.length > 0) {
  listBtnRefuseFriend.forEach(button => {
    button.addEventListener("click", () => {
      button.closest(".box-user").classList.add("refuse");

      const userId = button.getAttribute("btn-refuse-friend");

      socket.emit("CLIENT_REFUSE_FRIEND", userId);
    });
  });
}
// Hết Từ chối kết bạn


// Chấp nhận lời mời kết bạn
const listBtnAcceptFriend = document.querySelectorAll("[btn-accept-friend]");
if(listBtnAcceptFriend.length > 0) {
  listBtnAcceptFriend.forEach(button => {
    button.addEventListener("click", () => {
      button.closest(".box-user").classList.add("accepted");

      const userId = button.getAttribute("btn-accept-friend");

      socket.emit("CLIENT_ACCEPT_FRIEND", userId);
    });
  });
}
// Hết Chấp nhận lời mời kết bạn


// SERVER_RETURN_LENGTH_ACCEPT_FRIEND
socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", (data) => {
  const badgeUsersAccept = document.querySelector(`[badge-users-accept="${data.userId}"]`);
  if(badgeUsersAccept){
    badgeUsersAccept.innerHTML = data.lengthAcceptFriends;
  }
});
// End SERVER_RETURN_LENGTH_ACCEPT_FRIEND


// SERVER_RETURN_INFO_ACCEPT_FRIEND
socket.on("SERVER_RETURN_INFO_ACCEPT_FRIEND", (data) => {
  const dataUsersAccept = document.querySelector(`[data-users-accept="${data.userIdB}"]`);
  if(dataUsersAccept) {
    // console.log(data.infoUserA);

    const newBoxUser = document.createElement("div");
    newBoxUser.classList.add("col-6");
    newBoxUser.setAttribute("user-id", data.infoUserA._id)

    newBoxUser.innerHTML = `
      <div class="box-user">
        <div class="inner-avatar">
          <img src=${data.infoUserA.avatar} alt="${data.infoUserA.fullName}" />
        </div>
        <div class="inner-info">
            <div class="inner-name">
              ${data.infoUserA.fullName}
            </div>
            <div class="inner-buttons">
              <button
                class="btn btn-sm btn-primary mr-1"
                btn-accept-friend="${data.infoUserA._id}"
              >
                Chấp nhận
              </button>
              <button
                class="btn btn-sm btn-secondary mr-1"
                btn-refuse-friend="${data.infoUserA._id}"
              >
                Xóa
              </button>
              <button
                class="btn btn-sm btn-secondary mr-1"
                btn-deleted-friend=""
                disabled=""
              >
                Đã xóa
              </button>
              <button
                class="btn btn-sm btn-primary mr-1"
                btn-accepted-friend=""
                disabled=""
              >
                Đã chấp nhận
              </button>
            </div>
        </div>
      </div>
    `;

    dataUsersAccept.appendChild(newBoxUser);

    // vì box user khi gửi yêu cầu mới được vẽ ra -> các button phải load lại trang mới có chức năng
    // => thêm luôn chức năng cho các button khi vừa được vẽ ra

    // Xóa lời mời kết bạn
    const buttonRefuse = newBoxUser.querySelector("[btn-refuse-friend]");
    buttonRefuse.addEventListener("click", () => {
      buttonRefuse.closest(".box-user").classList.add("refuse");

      const userId = buttonRefuse.getAttribute("btn-refuse-friend");

      socket.emit("CLIENT_REFUSE_FRIEND", userId);
    });
    // Hết Xóa lời mời kết bạn

    // Chấp nhận lời mời kết bạn
    const buttonAccept = newBoxUser.querySelector("[btn-accept-friend]");
    buttonAccept.addEventListener("click", () => {
      buttonAccept.closest(".box-user").classList.add("accepted");

      const userId = buttonAccept.getAttribute("btn-accept-friend");

      socket.emit("CLIENT_ACCEPT_FRIEND", userId);
    });
    // Hết Chấp nhận lời mời kết bạn
  }
  
  // Khi A gửi kết bạn cho B, danh sách người dùng của B xóa đi A
  // dataUsersNotFriend là danh sách giao diện người dùng của B
  const dataUsersNotFriend = document.querySelector(`[data-users-not-friend="${data.userIdB}"]`);
  if(dataUsersNotFriend) {
    // tìm A
    const boxUserDelete = dataUsersNotFriend.querySelector(`[user-id="${data.infoUserA._id}"]`);
    dataUsersNotFriend.removeChild(boxUserDelete);
  }
});
// End SERVER_RETURN_INFO_ACCEPT_FRIEND



// SERVER_RETURN_ID_CANCEL_FRIEND
socket.on("SERVER_RETURN_ID_CANCEL_FRIEND", (data) => {
  // Đây là giao diện của B (chứa tất cả lời mời kb)
  const dataUsersAccept = document.querySelector(`[data-users-accept="${data.userIdB}"]`);
  // check xem nếu tồn tại giao diện B thì tìm A để xóa
  if(dataUsersAccept) {
    const boxUserA = dataUsersAccept.querySelector(`[user-id="${data.userIdA}"]`);
    if(boxUserA) {
      dataUsersAccept.removeChild(boxUserA);
    }
  }
});
// End SERVER_RETURN_ID_CANCEL_FRIEND


// SERVER_RETURN_USER_STATUS
socket.on("SERVER_RETURN_USER_STATUS", (data) => {
  // giao diện friend của B
  const dataUsersFriend = document.querySelector("[data-users-friend]");
  if(dataUsersFriend){
    // tìm đến boxUser muốn đổi trạng thái
    const boxUser = dataUsersFriend.querySelector(`[user-id="${data.userId}"]`);
    if(boxUser) {
      // tìm đến status của boxUser đó
      const boxStatus = boxUser.querySelector("[status]");
      // set lại thuộc tính của boxUser đó
      boxStatus.setAttribute("status", data.status);
    }
  }
})
// End SERVER_RETURN_USER_STATUS