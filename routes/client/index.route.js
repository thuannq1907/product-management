const productRoutes = require("./product.route.js")
const homeRoutes = require("./home.route.js")
const searchRoutes = require("./search.route.js")
const cartRoutes = require("./cart.route")
const checkoutRoutes = require("./checkout.route")
const userRoutes = require("./user.route")

const categoryMiddleware = require("../../middlewares/client/category.middleware")
const cartMiddleware = require("../../middlewares/client/cart.middleware")

module.exports = (app) => {
  // Vì cái danh mục sản phẩm này k cần bảo mật như authMiddleware nên có thể sd luôn
  app.use(categoryMiddleware.category);
  app.use(cartMiddleware.cart);

  app.get("/", homeRoutes);
  
  app.use("/products", productRoutes);

  app.use("/search", searchRoutes);
  
  app.use("/cart", cartRoutes);

  app.use("/checkout", checkoutRoutes);

  app.use("/user", userRoutes);
}
