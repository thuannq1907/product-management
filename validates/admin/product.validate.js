module.exports.createPost = async (req, res, next) => {
  // Ktra, bắt user phải nhập tiêu đề vào
  if(!req.body.title){
    req.flash("error", "Tiêu đề không được để trống!");
    res.redirect("back");
    return;
  }

  // Ktra, bắt user phải nhập đủ kí tự vào
  if(req.body.title.length < 5){
    req.flash("error", "Tiêu đề phải chứa ít nhất 5 kí tự!");
    res.redirect("back");
    return;
  }

  // khi pass qua validate.createPost rồi thì để nó chạy vào controller.createPost = cách next sang logic tiếp theo trong trang product.route.js
  next();
  // next là tham số thứ 3, là 1 hàm
}