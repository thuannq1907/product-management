const dashboardRoutes = require("./dashboard.route.js")
const productRoutes = require("./product.route.js")
const binRoutes = require("./bin.route.js")
const productCategoryRoutes = require("./products-category.route.js")
const roleRoutes = require("./role.route.js")
const accountRoutes = require("./account.route.js")

const systemConfig = require("../../config/system.js")

module.exports = (app) => {
  const PATH_ADMIN = `/${systemConfig.prefixAdmin}`;

  app.use( `${PATH_ADMIN}/dashboard`, dashboardRoutes);

  app.use( `${PATH_ADMIN}/products`, productRoutes);

  app.use( `${PATH_ADMIN}/bin`, binRoutes);

  app.use( `${PATH_ADMIN}/products-category`, productCategoryRoutes);

  app.use( `${PATH_ADMIN}/roles`, roleRoutes);

  app.use( `${PATH_ADMIN}/accounts`, accountRoutes);
}