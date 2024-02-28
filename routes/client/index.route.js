const productRoutes = require("./product.route.js")
const homeRoutes = require("./home.route.js")
const searchRoutes = require("./search.route.js")
const cartRoutes = require("./cart.route")
const checkoutRoutes = require("./checkout.route")
const userRoutes = require("./user.route")
const chatRoutes = require("./chat.route")

const categoryMiddleware = require("../../middlewares/client/category.middleware")
const cartMiddleware = require("../../middlewares/client/cart.middleware")
const userMiddleware = require("../../middlewares/client/user.middleware")
const settingMiddleware = require("../../middlewares/client/setting.middleware")

module.exports = (app) => {
  // Vì cái danh mục sản phẩm này k cần bảo mật như authMiddleware nên có thể sd luôn
  app.use(categoryMiddleware.category);
  app.use(cartMiddleware.cart);
  app.use(userMiddleware.infoUser);
  app.use(settingMiddleware.settingsGeneral);

  app.get("/", homeRoutes);
  
  app.use("/products", productRoutes);

  app.use("/search", searchRoutes);
  
  app.use("/cart", cartRoutes);

  app.use("/checkout", checkoutRoutes);

  app.use("/user", userRoutes);

  app.use("/chat", chatRoutes);
}
