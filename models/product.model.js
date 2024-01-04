const mongoose = require("mongoose");

// Tạo ra 1 bộ khung để định nghĩa những key mà user phải nhập vào để thêm vào database, còn những key k đc định nghĩa thì k thêm được => lquan đến bảo mật (thêm data)
const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  discountPercentage: Number,
  stock: Number,  
  thumbnail: String,
  status: String,
  position: Number,
  deleted: Boolean,
  deletedAt: Date
});

// Tạo ra 1 model tên là Product (là cái bên trong mongoose.model("Product", productSchema) còn cái bên ngoài chỉ để lưu trữ), tham số thứ 3 là tên collection trong database mà nó sẽ lấy ra
const Product = mongoose.model("Product", productSchema, "products")

module.exports = Product;

// Tương tự như b15
// const Products = mongoose.model("Product", {
//   title: String,
//   price: Number, 
//   thumbnail: String
// });