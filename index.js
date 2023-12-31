const express = require("express");
const dotenv = require("dotenv");
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const database = require("./config/database.js");
const systemConfig = require("./config/system.js");
const cookieParser = require('cookie-parser');
const session = require('express-session');

dotenv.config();

database.connect();

const routesClient = require("./routes/client/index.route.js");
const routesAdmin = require("./routes/admin/index.route.js");


const port = process.env.PORT;

const app = express();
// const port = 3000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.use(methodOverride('_method'));

app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.static("public"));

// flash
app.use(cookieParser('keyboard cat'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
// end flash

// App local variables => tạo ra biến toàn cục, sd trong mọi file
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// Routes Client
routesClient(app);

// Routes Admin
routesAdmin(app);

app.listen(port, () => {
  console.log(`App listening on ${port}`);
});