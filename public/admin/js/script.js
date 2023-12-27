// Button Status
const buttonStatus = document.querySelectorAll("[button-status]");
// buttonStatus lúc này là 1 mảng chứa các button

// Ktra có nút thì mới bắt sự kiện
if(buttonStatus.length > 0) {
  let url = new URL(window.location.href);
  // tạo link mới dựa vào link cũ ban đầu

  buttonStatus.forEach((button) => {
    button.addEventListener("click", () => {
      const status = button.getAttribute("button-status");

      // check xem ngta có click vào status active hoặc inactive không
      if(status){
        // update lại link = set(key, value) , dấu ? tự thêm vào => http://localhost:3000/admin/products?status=active
        url.searchParams.set("status", status);
      } else {
        // click vào nút tất cả thì xóa bỏ key đó vì mặc định là hiển thị tất cả => http://localhost:3000/admin/products
        url.searchParams.delete("status");
      }

      // gắn lại link vừa update
      window.location.href = url.href;
    });
  });
}

// End Button Status