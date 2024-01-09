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





// Pagination
const buttonPagination = document.querySelectorAll("[button-pagination]");
if(buttonPagination.length > 0){
  let url = new URL(window.location.href);

  buttonPagination.forEach((button) => {
    button.addEventListener("click", () => {
      const page = button.getAttribute("button-pagination");

      url.searchParams.set("page", page);

      window.location.href = url.href;
    })
  })
}
// End Pagination




// button-change-status
const buttonsChangeStatus = document.querySelectorAll("[button-change-status]");
if(buttonsChangeStatus.length > 0){

  const formChangeStatus = document.querySelector("[form-change-status]");
  const path = formChangeStatus.getAttribute("data-path");

  buttonsChangeStatus.forEach(button => {
    button.addEventListener("click", () => {
      const statusCurrent = button.getAttribute("data-status");
      const id = button.getAttribute("data-id");

      const statusChange = (statusCurrent == "active" ? "inactive" : "active")

      const action = `${path}/${statusChange}/${id}?_method=PATCH`;
      // => Bắt ngta nhập đúng phương thức mới cho cập nhật => an toàn hơn

      formChangeStatus.action = action;

      formChangeStatus.submit();
    });
  })
}

// End button-change-status





// checkbox-multi
const checkboxMulti = document.querySelector("[checkbox-multi]")
if(checkboxMulti) {
  // Lấy ra nút checkall
  const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");

  // Lấy ra 1 mảng các nút check sản phẩm
  const inputId = checkboxMulti.querySelectorAll("input[name='id']");

  // Click vào checkall => lấy hết các ô input
  inputCheckAll.addEventListener("click", () => {
    if(inputCheckAll.checked){
      inputId.forEach((input) => {
        input.checked = true;
      })
    } else {
      inputId.forEach((input) => {
        input.checked = false;
      })
    }
  });

  // Khi click hết vào ô input thì hiện check ở nút checkall, bỏ 1 ô input thì bỏ checkall
  inputId.forEach(input => {
    input.addEventListener("click", () => {
      // lấy ra các ô input có name là id và đã được check
      const countChecked = checkboxMulti.querySelectorAll("input[name='id']:checked");

      // So sánh độ dài
      if(countChecked.length == inputId.length){
        inputCheckAll.checked = true;
      } else {
        inputCheckAll.checked = false;
      }
    })
  })
}
// End checkbox-multi



// form-change-multi
const formChangeMulti = document.querySelector("[form-change-multi]");
if(formChangeMulti) {
  formChangeMulti.addEventListener("submit", (event) => {
    event.preventDefault();

    // value của option
    const type = event.target.elements.type.value;
    console.log(type);
    if(type == "delete-all"){
      const isConfirm = confirm("Bạn có chắc muốn xóa những bản ghi này?");
      if(isConfirm == false) {
        return;
      }
    }
    // Nếu ngta confirm là true thì thực hiện các câu lệnh bên dưới để lấy data

    // lấy ra các ô input đã check
    const inputsChecked = document.querySelectorAll("input[name='id']:checked");
    if(inputsChecked.length > 0){
      const ids = [];

      inputsChecked.forEach(input => {
        const id = input.value;
        if(type=="change-position"){
          // từ thẻ input có name='id' thì phải đi ra khỏi thẻ td, đến thẻ tr rồi mới bắt đầu từ thẻ tr đi tìm thẻ input có name='position'
          // input.closest("tr") nghĩa là đi ra đến thẻ tr rồi querySelector đến input có name='position'
          const position = input
            .closest("tr")
            .querySelector("input[name='position']").value;
            
          ids.push(`${id}-${position}`);
        } else {
          ids.push(id);
        }
      });

      const inputIds = formChangeMulti.querySelector("input[name='ids']");
      inputIds.value = ids.join(", ");

      formChangeMulti.submit();
    } else {
        alert("Vui lòng chọn ít nhất một bản ghi!");
    }

  })
}
// End form-change-multi



// buttonDelete
const buttonsDelete = document.querySelectorAll("[button-delete]");
if(buttonsDelete.length > 0){
  const formDeleteItem = document.querySelector("[form-delete-item]");
  const path = formDeleteItem.getAttribute("data-path");

  buttonsDelete.forEach(button => {
    button.addEventListener("click", () => {
      const isConfirm = confirm("Bạn có chắc muốn xóa bản ghi này?");

      if(isConfirm){
        const id = button.getAttribute("data-id");
        const action = `${path}/${id}?_method=DELETE`;

        formDeleteItem.action = action;
        formDeleteItem.submit();
      }
    })
  })
}

// End buttonDelete



// Show Alert
const showAlert = document.querySelector("[show-alert]");
if(showAlert){
  const time = parseInt(showAlert.getAttribute("data-time"));
  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, time);

    const closeAlert = showAlert.querySelector("[close-alert]");
    closeAlert.addEventListener("click", () => {
      showAlert.classList.add("alert-hidden");
  });
}


// End Show Alert


// Recover 1 Item
const buttonRecover = document.querySelectorAll("[button-recover]");
if(buttonRecover.length > 0){
  buttonRecover.forEach(button => {
    button.addEventListener("click", () => {
      const isConfirm = confirm("Bạn có chắc muốn khôi phục bản ghi này?"); 
        
      if(isConfirm){
        const id = button.getAttribute("data-id");
  
        const formRecover = document.querySelector("[form-recover-item]");
        const path = formRecover.getAttribute("data-path");
  
        const action = `${path}/${id}?_method=PATCH`;
        formRecover.action = action;
  
        formRecover.submit();
      }
    })
  })
}
// End Recover 1 Item



// Recover Multi
const formRecoverMulti = document.querySelector("[form-recover-multi]");
if(formRecoverMulti) {
  const idRecover = [];
  formRecoverMulti.addEventListener("submit", (event) => {
    event.preventDefault();

    const type = event.target.elements.type.value;
    console.log(type);

    const inputChecked = document.querySelectorAll("input[name='id']:checked");
    inputChecked.forEach(input => {
      idRecover.push(input.value);
    })

    const inputRecover = formRecoverMulti.querySelector("input[name='idRecover']");
    inputRecover.value = idRecover.join(", ");

    formRecoverMulti.submit();
  })
}
// End Recover Multi



// button delete forever
const buttonDeleteForever = document.querySelectorAll("[button-delete-forever]");
if(buttonDeleteForever.length > 0){
  const formDeleteForever = document.querySelector("[form-delete-forever]");
  const path = formDeleteForever.getAttribute("data-path");

  buttonDeleteForever.forEach(button => {
    button.addEventListener("click", () => {
      const isConfirm = confirm("Bạn có chắc muốn xóa vĩnh viễn bản ghi này");
      if(isConfirm){
        const id = button.getAttribute("data-id");
  
        const action = `${path}/${id}?_method=DELETE`;
        formDeleteForever.action = action;
  
        formDeleteForever.submit();
      }
    })
  })
}
// End button delete forever




// Preview Image
const uploadImage = document.querySelector("[upload-image]");
if(uploadImage) {
  const uploadImageInput = uploadImage.querySelector("[upload-image-input]");
  const uploadImagePreview = uploadImage.querySelector("[upload-image-preview]");

  uploadImageInput.addEventListener("change", (event) => {
    // sd Destructuring lấy ra 1 file
    const [file] = uploadImageInput.files;
    if (file) {
      uploadImagePreview.src = URL.createObjectURL(file);
    }
  });
}
// End Preview Image