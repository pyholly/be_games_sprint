const fs = require("fs/promises");

exports.getEndPoints = (req, res) => {
  fs.readFile(__dirname + "/../endpoints.json", "utf-8").then((object) => {
    const parsedObject = JSON.parse(object);
    res.status(200).send({ object: parsedObject });
  });
};
