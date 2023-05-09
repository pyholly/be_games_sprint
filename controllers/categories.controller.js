const { selectCategories } = require("../models/categories.model");

exports.getCategories = (req, res) => {
  selectCategories().then((result) => {
    res.status(200).send({ categories: result.rows });
  });
};
