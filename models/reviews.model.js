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
