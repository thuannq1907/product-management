const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");

// [GET] /cart/
module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId;

  const cart = await Cart.findOne({
    _id: cartId
  });

  // tính tổng tiền cả đơn hàng, thêm 1 key totalPrice vào giỏ hàng
  cart.totalPrice = 0;

  // lặp để lấy từng sản phẩm trong mảng products 
  if(cart.products.length > 0) {
    for (const item of cart.products) {
      // lấy t.tin chi tiết sp thông qua id của sp trong giỏ hàng
      const product = await Product.findOne({
        _id: item.product_id
      }).select("thumbnail title slug price discountPercentage");
      // chỉ lấy những key cần thôi vì nếu lấy hết products sẽ dư nhiều t.tin

      product.priceNew = (product.price * (100 - product.discountPercentage)/100).toFixed(0);

      // lấy xong r thì add những key đó vào cart.products trong giỏ hàng
      item.productInfo = product;

      // tính tổng tiền theo số lượng của sp, totalPrice này là của sp trong products
      item.totalPrice = item.quantity * product.priceNew;

      // tính tổng tiền cả đơn hàng, totalPrice này là của giỏ hàng
      cart.totalPrice += item.totalPrice;
    }
  }

  res.render("client/pages/cart/index.pug", {
    pageTitle: "Giỏ hàng",
    cartDetail: cart
  });
}

// [POST] /cart/add/:productId
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

// [GET] /cart/delete/:productId
module.exports.delete = async (req, res) => {
  const cartId = req.cookies.cartId;
  const productId = req.params.productId;

  await Cart.updateOne({
    _id: cartId
  }, {
    // xóa đi sp có product_id giống vs id ngta gửi lên trong mảng products trong collection cart
    $pull: { products: { product_id: productId } }
  });

  req.flash("success", "Đã xóa sản phẩm khỏi giỏ hàng!");

  res.redirect("back");
};

// [GET] /cart/update/:productId/:quantity
module.exports.update = async (req, res) => {
  try {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    const quantity = req.params.quantity;
  
    await Cart.updateOne({
      _id: cartId,
      "products.product_id": productId
    }, {
      $set: { "products.$.quantity": quantity }
    });
  
    req.flash("success", "Cập nhật số lượng thành công!");
  
    res.redirect("back");
    
  } catch (error) {
    res.redirect("/");
  }
}