const db = require("../connection");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.createRef = (arr, key, value) => {
  return arr.reduce((ref, element) => {
    ref[element[key]] = element[value];
    return ref;
  }, {});
};

exports.formatComments = (comments, idLookup) => {
  return comments.map(({ created_by, belongs_to, ...restOfComment }) => {
    const article_id = idLookup[belongs_to];
    return {
      article_id,
      author: created_by,
      ...this.convertTimestampToDate(restOfComment),
    };
  });
};

exports.checkIdExists = (id) => {
  return db
    .query("SELECT * FROM comments WHERE review_id = $1;", [id])
    .then((result) => {
      if (result.rows.length === 0 && id) {
        return Promise.reject({ status: 404, msg: "id not found" });
      }
    });
};

exports.checkUsernameExists = (username) => {
  return db
    .query("SELECT * FROM comments WHERE author = $1;", [username])
    .then((result) => {
      console.log(result.rows);
      if (result.rows.length === 0 && !username) {
        return Promise.reject({
          status: 404,
          msg: "please provide a username",
        });
      } else if (result.rows.length === 0 && username) {
        return Promise.reject({
          status: 404,
          msg: "please provide valid username",
        });
      }
    });
};
