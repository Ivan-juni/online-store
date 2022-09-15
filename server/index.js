const express = require("express");
const mongoose = require("mongoose");
const app = express();

require("dotenv").config();
const port = process.env.PORT || 5000;

app.get("/", (request, response) => {
  response.send("Hello world");
});
