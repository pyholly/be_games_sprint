const express = require("express");
const app = express();
const { getCategories } = require("./controllers/categories.controller");
const { getReviewId } = require("./controllers/reviews.controller");

module.exports = app;

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReviewId);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "request not found" });
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else if (err.code === "22P02") {
    console.log(err + "< err1");
    res.status(400).send({ msg: "bad request" });
  } else {
    console.log(err + "< err2");
    res.status(500).send("Server Error!");
  }
});
