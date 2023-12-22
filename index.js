const express = require("express");
const routesClient = require("./routes/client/index.route.js")

const app = express();
const port = 3000;

app.set("views", "./views");
app.set("view engine", "pug");

// Routes Client
routesClient(app);

app.listen(port, () => {
  console.log(`App listening on ${port}`);
});