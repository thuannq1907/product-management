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