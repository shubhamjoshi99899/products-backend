const express = require("express");
const app = express();
require("dotenv/config");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const api = process.env.API_URL;
const productsRouter = require("./routers/products");
const categoryRouter = require("./routers/category");
const userRouter = require("./routers/user");
const orderRouter = require("./routers/order");
const errorHandlers = require("./helpers/errorhandler");
const authJwt = require("./helpers/jwt");

//Middleware
app.use(bodyParser.json());
app.use(morgan("tiny"));
app.use(authJwt());
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));
app.use(errorHandlers);

//Routers
app.use(`${api}/products`, productsRouter);
app.use(`${api}/category`, categoryRouter);
app.use(`${api}/users`, userRouter);
app.use(`${api}/orders`, orderRouter);

mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "cane-planet",
  })
  .then(() => {
    console.log("databse connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(3005, () => {
  console.log(api);
  console.log("Server is started at 3000");
});
