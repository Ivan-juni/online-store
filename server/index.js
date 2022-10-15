const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const router = require("./routes/index");
const errorHandler = require("./middleware/ErrorHandlingMiddleware");

require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
// For parsing apllication/json
app.use(express.json());

// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Path to images folder
app.use("/static", express.static(__dirname + "/assets"));

// Redirect || Routers
app.use("/api", router);

// Errors Middleware
app.use(errorHandler);

app.get("/", (request, response) => {
  response.send("Hello world");
});

mongoose.connect("mongodb://localhost:27017/online-storedb").then(() => {
  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
});
