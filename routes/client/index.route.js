// file index chứa những route chính
const productRoutes = require("./product.route.js")
const homeRoutes = require("./home.route.js")

// viết 1 hàm để export nó ra để file index.js có thể dùng = cách require (import)
module.exports = (app) => {
  app.get("/", homeRoutes);
  
  app.use("/products", productRoutes);
  // use là kiểu định nghĩa phương thức chung chung, còn định nghĩa phương thức cụ thể thì ở bên trong productRoutes
}



// Tương tự như js
// export const routesClient = () {
//   app.get("/",(req, res) => {
//     res.render("client/pages/home/index.pug")
//   });
  
//   app.get("/products", (req, res) => {
//     res.render("client/pages/products/index.pug")
//   })
// }