// Chứa những hàm controller của các route product
// export ra để các file khác còn dùng, cú pháp export trong js <=> module.export trong express

// index là tên hàm tự đặt, t/ư vs phương thức [GET] /products/
module.exports.index = (req, res) => {
  res.render("client/pages/products/index.pug");
}

// [GET] /products/detail
module.exports.detail = (req, res) => {
  res.send("Trang chi tiết sản phẩm");
}

// [GET] /products/edit
module.exports.edit = (req, res) => {
  
}

// [GET] /products/create
module.exports.create = (req, res) => {
  
}


// Vì export tận 4 hàm => khi import sẽ gộp 4 hàm lại thành 1 object