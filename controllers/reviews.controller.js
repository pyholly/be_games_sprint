const {
  selectReviewId,
  selectCommentsById,
} = require("../models/reviews.model");

exports.getReviewId = (req, res, next) => {
  const { review_id } = req.params;
  selectReviewId(review_id)
    .then((result) => {
      res.status(200).send({ review: result });
    })
    .catch(next);
};

exports.getCommentsById = (req, res) => {
  const { review_id } = req.params;
  selectCommentsById(review_id).then((results) => {
    res.status(200).send({ comments: results });
  });
};
