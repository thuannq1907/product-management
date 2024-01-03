const express = require("express");
const dotenv = require("dotenv");
var methodOverride = require('method-override');
const database = require("./config/database.js")
const systemConfig = require("./config/system.js")

dotenv.config();

database.connect();

const routesClient = require("./routes/client/index.route.js");
const routesAdmin = require("./routes/admin/index.route.js");


const port = process.env.PORT;

const app = express();
// const port = 3000;

app.use(methodOverride('_phuongThuc'));

app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.static("public"));

// App local variables => tạo ra biến toàn cục, sd trong mọi file
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// Routes Client
routesClient(app);

// Routes Admin
routesAdmin(app);

app.listen(port, () => {
  console.log(`App listening on ${port}`);
});