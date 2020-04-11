const mongoosePostModel = require('../model/postModel');

exports.createPost = (req, res) => {
      const post = new mongoosePostModel(req.body);
      post.save().then(result => {
        res.send({
            post: result
        });
    });
};
