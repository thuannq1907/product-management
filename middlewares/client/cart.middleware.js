const Cart = require("../../models/cart.model");

module.exports.cart = async (req, res, next) => {
  // ktra, nếu chưa có giỏ hàng thì tạo mới giỏ hàng (rỗng) và lưu vào database
  if(!req.cookies.cartId) {
    const cart = new Cart();
    await cart.save();

    // tạo thời gian lưu cookie 3 ngày
    const expire = 3 * 24 * 60 * 60 * 1000;

    // sau khi tạo mới giỏ hàng rồi thì lưu id của giỏ hàng đó vào cookie
    res.cookie("cartId", cart.id, { expires: new Date(Date.now() + expire) });
  }
  next();
}