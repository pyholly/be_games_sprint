const db = require("../db/connection");

exports.selectReviewId = (id) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id =  $1`, [id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No user found for Id of ${id}`,
        });
      }
      return result.rows;
    });
};

exports.selectReviews = () => {
  return db
    .query(
      `SELECT reviews.review_id, reviews.owner, reviews.title, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer, COUNT(comments.review_id) AS comment_count
  FROM reviews
  LEFT JOIN comments
  ON reviews.review_id = comments.review_id
  GROUP BY reviews.review_id
  ORDER BY reviews.created_at DESC;`
    )
    .then((result) => {
      return result.rows;
    });
};

exports.insertComment = (comment, id) => {
  const { username, body } = comment;
  if (!body) {
    return Promise.reject({
      status: 404,
      msg: "please provide a comment",
    });
  }
  return db
    .query(
      "INSERT INTO comments (author, body, review_id) VALUES ($1, $2, $3) RETURNING *;",
      [username, body, id]
    )
    .then((result) => {
      return result.rows[0];
    });
};
