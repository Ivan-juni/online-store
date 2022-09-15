const express = require("express");
const mongoose = require("mongoose");
const app = express();

require("dotenv").config();
const port = process.env.PORT || 5000;

// For parsing apllication/json
app.use(express.json());
// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ esxtended: true }));
// Path to images folder
app.use("/static", express.static(__dirname + "/assets"));
// Redirect to folder
app.use("/api/games", require("./routes/games.js"));

app.get("/", (request, response) => {
  response.send("Hello world");
});

mongoose.connect("mongodb://localhost:27017/online-storedb").then(() => {
  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
});
