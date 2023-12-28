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




// Form Search
const formSearch = document.querySelector("#form-search");
if(formSearch){
  formSearch.addEventListener("submit", (event) => {
    let url = new URL(window.location.href);

    event.preventDefault();
    // ngăn chặn hành vi mặc định - load lại trang để k bị ghi đè

    const keyword = event.target.elements.keyword.value;
    // lấy ra đc keyword user nhập vào
    if(keyword) {
      url.searchParams.set("keyword", keyword);
    } else {
      url.searchParams.delete("keyword");
    }

    window.location.href = url.href;
  })
}
// End Form Search