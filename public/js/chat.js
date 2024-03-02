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
    }
  });
}
// End CLIENT_SEND_MESSAGE


// SERVER_SEND_MESSAGE
socket.on("SERVER_SEND_MESSAGE", (data) => {
  const body = document.querySelector(".chat .inner-body");
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

  // thêm thẻ div vừa tạo vào cuối inner-body (đoạn hội thoại)
  body.appendChild(div);

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

  emojiPicker.addEventListener('emoji-click', event => {
    const icon = event.detail.unicode;
    // khi chọn icon thì cập nhật value trong input = cách nối icon đó vào value cũ
    inputChat.value = inputChat.value + icon;
  });
}
// End Show Icon Chat