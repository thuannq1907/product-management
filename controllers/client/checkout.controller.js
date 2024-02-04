const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const Order = require("../../models/order.model");

// [GET] /checkout/
module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId;

  const cart = await Cart.findOne({
    _id: cartId
  });

  cart.totalPrice = 0;

  if(cart.products.length > 0) {
    for (const item of cart.products) {
      const product = await Product.findOne({
        _id: item.product_id
      }).select("thumbnail title slug price discountPercentage");

      product.priceNew = (product.price * (100 - product.discountPercentage)/100).toFixed(0);

      item.productInfo = product;

      item.totalPrice = item.quantity * product.priceNew;

      cart.totalPrice += item.totalPrice;
    }
  }

  res.render("client/pages/checkout/index", {
    pageTitle: "Đặt hàng",
    cartDetail: cart
  });
};

// [POST] /checkout/order
module.exports.order = async (req, res) => {
  const cartId = req.cookies.cartId;
  const infoUser = req.body;

  const orderInfo = {
    cart_id: cartId,
    userInfo: infoUser,
    products: [],
  };

  // có id giỏ hàng rồi -> lấy ra các id sp trong giỏ hàng = cart.products
  const cart = await Cart.findOne({
    _id: cartId
  });

  // có id sp rồi -> lấy chi tiết sp thông qua id: price, %, quantity
  for (const product  of cart.products) {
    const infoProduct = await Product.findOne({
      _id: product.product_id
    });

    // định nghĩa 1 object có dạng ntn
    const objectProduct = {
      product_id: product.product_id,
      price: infoProduct.price,
      discountPercentage: infoProduct.discountPercentage,
      quantity: product.quantity,
    }

    // push object đó vào mảng products của object orderInfo
    orderInfo.products.push(objectProduct);
  }

  // lưu vào database
  const order = new Order(orderInfo);
  await order.save();

  // sau khi đặt hàng xong -> update lại giỏ hàng trống, cho products thành 1 mảng rỗng
  await Cart.updateOne({
    _id: cartId
  }, {
    products: []
  });

  // chuyển hướng sang trang đặt hàng thành công
  res.redirect(`/checkout/success/${order.id}`);
};