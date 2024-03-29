import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'

// Upload Image
// UP 1 ẢNH
// const upload = new FileUploadWithPreview.FileUploadWithPreview('upload-images');

// UP NHIỀU ẢNH
const upload = new FileUploadWithPreview.FileUploadWithPreview('upload-images', {
  multiple: true,
  maxFileCount: 6
  // đc up tối đa 6 ảnh
});
// End Upload Image


// CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat .inner-form");
if(formSendData) {
  const inputContent = formSendData.querySelector("input[name='content']");
  formSendData.addEventListener("submit", (event) => {
    event.preventDefault();
    const content = inputContent.value;
    // k up ảnh thì ảnh là 1 mảng rỗng
    const images = upload.cachedFileArray || [];
    if(content || images.length > 0) {
      socket.emit("CLIENT_SEND_MESSAGE", {
        content: content,
        images: images
      });
      inputContent.value = "";
      // khi gửi tin nhắn thì tắt typing luôn
      socket.emit("CLIENT_SEND_TYPING", "hidden");
      // up lên xong thì xóa ảnh đã chọn
      upload.resetPreviewPanel();
    }
  });
}
// End CLIENT_SEND_MESSAGE


// SERVER_SEND_MESSAGE
socket.on("SERVER_SEND_MESSAGE", (data) => {
  const body = document.querySelector(".chat .inner-body");
  const elementListTyping = body.querySelector(".inner-list-typing");
  const myId = document.querySelector("[my-id]").getAttribute("my-id");

  const div = document.createElement("div");
  let htmlFullName = "";
  let htmlContent = "";
  let htmlImages = "";

  if(myId != data.userId) {
    div.classList.add("inner-incoming");
    htmlFullName = `<div class="inner-name">${data.fullName}</div>`;
  } else {
    div.classList.add("inner-outgoing");
  }

  if(data.content) {
    htmlContent = `
      <div class="inner-content">${data.content}</div>
    `;
  }

  if(data.images.length > 0) {
    // Nối chuỗi
    htmlImages += `<div class="inner-images">`;

    // data.images là 1 mảng chứa các link ảnh Cloudinary
    for (const image of data.images) {
      htmlImages += `
        <img src="${image}">
      `;
    }

    htmlImages += `</div>`;
  }

  div.innerHTML = `
    ${htmlFullName}
    ${htmlContent}
    ${htmlImages}
  `

  // thêm thẻ div vừa tạo vào trước typing
  body.insertBefore(div, elementListTyping);

  // Để khi load lại hay gửi tin nhắn thì thanh scroll luôn ở dưới cùng
  body.scrollTop = body.scrollHeight;

  // tin nhắn real time có thể view luôn mà k cần load lại trang
  const gallery = new Viewer(div);
})
// End SERVER_SEND_MESSAGE


// Scroll Chat To Bottom
// load lại hay gửi tin nhắn thì thanh scroll luôn lướt xuống dưới cùng
const bodyChat = document.querySelector(".chat .inner-body");
if(bodyChat) {
  bodyChat.scrollTop = bodyChat.scrollHeight;
}
// End Scroll Chat To Bottom


// Show Icon Chat
const buttonIcon = document.querySelector('.button-icon');

if(buttonIcon){
  const tooltip = document.querySelector('.tooltip');
  Popper.createPopper(buttonIcon, tooltip);
  // => tạo ra 1 pop up (<=> bảng) chứa icon khi bật lên

  
  // Show Tooltip (khi nhấn vào thì hiện ra bảng chọn icon)
  buttonIcon.addEventListener("click", () => {
    tooltip.classList.toggle('shown');
  });


  // Insert Icon To Input
  const emojiPicker = document.querySelector('emoji-picker');
  const inputChat = document.querySelector(".chat .inner-form input[name='content']");

  // Insert Icon
  emojiPicker.addEventListener('emoji-click', event => {
    const icon = event.detail.unicode;
    // khi chọn icon thì cập nhật value trong input = cách nối icon đó vào value cũ
    inputChat.value = inputChat.value + icon;
  });

  // Show Typing
  var timeOut;

  inputChat.addEventListener("keyup", (event) => {
    socket.emit("CLIENT_SEND_TYPING", "show");

    // còn gõ thì sẽ xóa bỏ hàm setTimeout, k gõ nữa thì mới gửi lên sk hidden sau 3s
    // lần đầu timeOut sẽ là undefined, xóa timeOut xong lại cập nhật lại timeOut
    clearTimeout(timeOut);

    // sau vài giây gửi lên sk khác để tắt typing
    timeOut = setTimeout(() => {
      socket.emit("CLIENT_SEND_TYPING", "hidden");
    }, 3000);

    // enter gửi thì tắt typing
    if(event.keyCode == 13){
      socket.emit("CLIENT_SEND_TYPING", "hidden");
    }
  });
}
// End Show Icon Chat



// SERVER_RETURN_TYPING
const elementListTyping = document.querySelector(".chat .inner-body .inner-list-typing");

socket.on("SERVER_RETURN_TYPING", (data) => {
  if(data.type == "show") {
    // ktra xem đã tồn tại typing chưa, chưa thì appendChild vào inner-list-typing
    const existTyping = elementListTyping.querySelector(`.box-typing[user-id="${data.userId}"]`);

    // khi đang soạn tin nhắn thì typing hiện ở dưới (hoặc có thể fix position của typing)
    const body = document.querySelector(".chat .inner-body");

    // Nếu k tồn tại -> insert vào
    if(!existTyping){
      const boxTyping = document.createElement("div");
      boxTyping.classList.add("box-typing");
      boxTyping.setAttribute("user-id", data.userId);
      boxTyping.innerHTML = `
        <div class="inner-name">${data.fullName}</div>
        <div class="inner-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      `;

      elementListTyping.appendChild(boxTyping);
      body.scrollTop = body.scrollHeight;
    } 
  } else {
    // type = hidden -> remove
    const boxTypingRemove = elementListTyping.querySelector(`.box-typing[user-id="${data.userId}"]`);

    if(boxTypingRemove){
      elementListTyping.removeChild(boxTypingRemove);
    }
  }
});
// End SERVER_RETURN_TYPING

// Preview Image
// truy vấn đến thẻ cha bên ngoài các ảnh thì tất cả ảnh bên trong sẽ view lên được
// chỉ chạy khi load lại trang -> tin nhắn realtime muốn view -> load lại -> xử lý luôn khi up tin nhắn
if(bodyChat) {
  const gallery = new Viewer(bodyChat);
}
// End Preview Image