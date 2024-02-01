const Cart = require("../../models/cart.model");

module.exports.addPost = async (req, res) => {
  // id sp user gửi lên
  const productId = req.params.productId;
  // số lượng sp mua
  const quantity = parseInt(req.body.quantity);
  // id giỏ hàng của tk user đó
  const cartId = req.cookies.cartId;

  try {
    const cart = await Cart.findOne({
      _id: cartId
    });

    // tìm các sp có id giống vs user gửi lên (tìm các sp tồn tại trong giỏ hàng)
    const existProductInCart = cart.products.find(item => item.product_id == productId);

    // nếu có tồn tại sẵn sp trong giỏ hàng thì update quantity, k có thì tạo mới sp
    if(existProductInCart) {
      const quantityNew = existProductInCart.quantity + quantity;

      // update lại = cách tìm đến giỏ hàng, rồi tìm đến sp muốn update
      await Cart.updateOne({
        _id: cartId,
        "products.product_id": productId
        // vì có ký tự đb -> chuyển thành 1 chuỗi
      }, {
        $set: { "products.$.quantity": quantityNew }
      });

    } else {
      const objectCart = {
        product_id: productId,
        quantity: quantity
      };
  
      await Cart.updateOne(
        { _id: cartId },
        {
          // push vào giỏ hàng ở key products 1 objetc chứa id và số lượng
          $push: { products: objectCart },
        }
      );
    }

    req.flash("success", `Đã thêm sản phẩm vào giỏ hàng!`);
  } catch (error) {
    req.flash("error", `Thêm sản phẩm vào giỏ hàng không thành công!`);
  }

  res.redirect("back");
};