// Có nhiệm vụ kết nối vào database
const mongoose = require("mongoose");

// hàm connect để kết nối vào database
module.exports.connect = () => {
  mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('Connected!'));
}