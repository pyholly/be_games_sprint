const {
  selectReviewId,
  selectReviews,
  selectCommentsById,
} = require("../models/reviews.model");
const { checkIdExists, checkUsernameExists } = require("../db/seeds/utils");
const {
  selectReviewId,
  selectReviews,
  insertComment,
} = require("../models/reviews.model");

exports.getReviewId = (req, res, next) => {
  const { review_id } = req.params;
  selectReviewId(review_id)
    .then((result) => {
      res.status(200).send({ review: result });
    })
    .catch(next);
};

exports.getReviews = (req, res) => {
  selectReviews().then((results) => {
    res.status(200).send({ reviews: results });
  });
};

exports.getCommentsById = (req, res, next) => {
  const { review_id } = req.params;
  selectCommentsById(review_id)
    .then((results) => {
      res.status(200).send({ comments: results });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const { review_id } = req.params;
  const comment = req.body;
  checkIdExists(review_id).catch((err) => next(err));
  checkUsernameExists(comment.username).catch((err) => next(err));
  insertComment(comment, review_id)
    .then((result) => {
      res.status(201).send({ comment: result });
    })
    .catch(next);
};
