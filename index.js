const express = require("express");
const dotenv = require("dotenv");
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const database = require("./config/database.js");
const systemConfig = require("./config/system.js");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const moment = require("moment");
const http = require('http');
const { Server } = require("socket.io");

dotenv.config();

database.connect();

const routesClient = require("./routes/client/index.route.js");
const routesAdmin = require("./routes/admin/index.route.js");


const port = process.env.PORT;

const app = express();
// const port = 3000;

// SocketIO
const server = http.createServer(app);
const io = new Server(server);

global._io = io;
// tạo ra biến toàn cục tên là _io để sd ở cả những file js còn locals chỉ sd đc ở bên pug
// End SocketIO


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.use(methodOverride('_method'));

app.set("views", `${__dirname}/views`);
// __dirname là đường dẫn thư mục vì lúc đẩy lên online thì nó k hiểu => đi từ thư mục gốc vào
app.set("view engine", "pug");

app.use(express.static(`${__dirname}/public`));

/* New Route to the TinyMCE Node module */
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

// flash
app.use(cookieParser('keyboard cat'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
// end flash

// App local variables => tạo ra biến toàn cục, sd trong mọi file
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;

// Routes Client
routesClient(app);

// Routes Admin
routesAdmin(app);

// 404 Not Found (những route k tồn tại), ngoài 2 route chính là client và admin thì redirect hết về trang 404
app.get("*", (req, res) => {
  res.render("client/pages/errors/404.pug", {
    pageTitle: "404 Not Found",
  });
  // muốn chuẩn SEO thì back về trang chủ
  // res.redirect("/");
});

server.listen(port, () => {
  console.log(`App listening on ${port}`);
});