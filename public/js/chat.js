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