const mongoosePostModel = require("../model/postModel");

exports.createPost = (req, res) => {
  const covid = new mongoosePostModel(req.body);
  covid.save().then((result) => {
    res.send({
      covid: result,
    });
  });
};
