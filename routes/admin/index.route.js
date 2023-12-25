// file chứa tất cả route trang admin
const dashboardRoutes = require("./dashboard.route.js")
const systemConfig = require("../../config/system.js")
// systemConfig bh là 1 object

module.exports = (app) => {
  const PATH_ADMIN = `/${systemConfig.prefixAdmin}`;

  app.use( `${PATH_ADMIN}/dashboard`, dashboardRoutes);
}