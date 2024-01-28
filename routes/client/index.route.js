const productRoutes = require("./product.route.js")
const homeRoutes = require("./home.route.js")

const categoryMiddleware = require("../../middlewares/client/category.middleware")

module.exports = (app) => {
  // Vì cái danh mục sản phẩm này k cần bảo mật như authMiddleware nên có thể sd luôn
  // app.use(categoryMiddleware.category);

  app.get("/", categoryMiddleware.category, homeRoutes);
  
  app.use("/products", categoryMiddleware.category, productRoutes);
}
