import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'

// CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat .inner-form");
if(formSendData) {
  const inputContent = formSendData.querySelector("input[name='content']");
  formSendData.addEventListener("submit", (event) => {
    event.preventDefault();
    const content = inputContent.value;
    if(content) {
      socket.emit("CLIENT_SEND_MESSAGE", content);
      inputContent.value = "";
      // khi gửi tin nhắn thì tắt typing luôn
      socket.emit("CLIENT_SEND_TYPING", "hidden");
    }
  });
}
// End CLIENT_SEND_MESSAGE


// SERVER_SEND_MESSAGE
socket.on("SERVER_SEND_MESSAGE", (data) => {
  const body = document.querySelector(".chat .inner-body");
  const elementListTyping = body.querySelector(".inner-list-typing");
  // myId là id của tk khi đăng nhập còn data.userId là id của ng gửi tin nhắn (id này cx đc lấy khi đăng nhập) => so sánh
  const myId = document.querySelector("[my-id]").getAttribute("my-id");

  const div = document.createElement("div");
  let htmlFullName = "";

  if(myId != data.userId) {
    div.classList.add("inner-incoming");
    htmlFullName = `<div class="inner-name">${data.fullName}</div>`;
  } else {
    div.classList.add("inner-outgoing");
  }

  div.innerHTML = `
    ${htmlFullName}
    <div class="inner-content">${data.content}</div>
  `

  // thêm thẻ div vừa tạo vào trước typing
  body.insertBefore(div, elementListTyping);

  // Để khi load lại hay gửi tin nhắn thì thanh scroll luôn ở dưới cùng
  body.scrollTop = body.scrollHeight;
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