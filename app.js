const express = require("express");
const app = express();
const { getCategories } = require("./controllers/categories.controller");
const {
  getReviewId,
  getReviews,
  getCommentsById,
} = require("./controllers/reviews.controller");
const { getEndPoints } = require("./controllers/api.controller");

module.exports = app;

app.get("/api/categories", getCategories);

app.get("/api", getEndPoints);

app.get("/api/reviews/:review_id", getReviewId);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id/comments", getCommentsById);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "request not found" });
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "bad request" });
  } else next(err);
});

app.use((err, req, res, next) => {
  res.status(500).send("Server Error!");
});
