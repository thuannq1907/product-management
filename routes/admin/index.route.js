const dashboardRoutes = require("./dashboard.route.js")
const productRoutes = require("./product.route.js")
const binRoutes = require("./bin.route.js")
const productCategoryRoutes = require("./products-category.route.js")
const roleRoutes = require("./role.route.js")
const accountRoutes = require("./account.route.js")
const authRoutes = require("./auth.route.js")
const myAccountRoutes = require("./my-account.route")

const systemConfig = require("../../config/system.js")

const authMiddleware = require("../../middlewares/admin/auth.middleware.js")

module.exports = (app) => {
  const PATH_ADMIN = `/${systemConfig.prefixAdmin}`;

  app.use(
    `${PATH_ADMIN}/dashboard`,
    authMiddleware.requireAuth,
    dashboardRoutes
  );

  app.use(
    `${PATH_ADMIN}/products`,
    authMiddleware.requireAuth,
    productRoutes
  );

  app.use(
    `${PATH_ADMIN}/bin`,
    authMiddleware.requireAuth,
    binRoutes
  );

  app.use(
    `${PATH_ADMIN}/products-category`,
    authMiddleware.requireAuth,
    productCategoryRoutes
  );

  app.use(
    `${PATH_ADMIN}/roles`,
    authMiddleware.requireAuth,
    roleRoutes
  );

  app.use(
    `${PATH_ADMIN}/accounts`,
    authMiddleware.requireAuth,
    accountRoutes
  );

  app.use(
    `${PATH_ADMIN}/my-account`,
    authMiddleware.requireAuth,
    myAccountRoutes
  );

  app.use(
    `${PATH_ADMIN}/auth`,
    authRoutes
  );
}