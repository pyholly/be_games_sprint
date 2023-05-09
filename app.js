const express = require("express");
const app = express();
const { getCategories } = require("./controllers/categories.controller");

module.exports = app;

app.get("/api/categories", getCategories);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "request not found" });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Server Error!");
});
