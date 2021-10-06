import BlogPostModel from "../../models/blogPost.js";

const postComment = async (req, res, next) => {
  try {
    // find a post to post a comment on
    const blogPost = await BlogPostModel.findById(req.params.postId, {
      _id: 0,
    });
    if (blogPost) {
      const commentToInsert = {
        ...req.body,
        asin: req.params.postId,
        commentDate: new Date(),
      };

      await BlogPostModel.findByIdAndUpdate(
        req.params.postId,
        { $push: { comments: commentToInsert } },
        { new: true }
      );

      res.send(commentToInsert);
    } else {
      res.send(createHttpError(404, "Not found"));
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    // get blogPost
    const blogPost = await BlogPostModel.findByIdAndUpdate(
      req.params.postId,
      { $pull: { comments: { _id: req.params.commentId } } }, // HOW
      { new: true } // options
    );
    if (blogPost) {
      res.send("deleted");
    } else {
      next(
        createHttpError(
          404,
          `Comment with id ${req.params.commentId} not found!`
        )
      );
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const editComment = async (req, res, next) => {
  try {
    // get blogPost
    const blogPost = await BlogPostModel.findById(req.params.postId);
    if (blogPost) {
      const commentIndex = blogPost.comments.findIndex(
        (comment) => comment._id.toString() === req.params.commentId
      );
      if (commentIndex !== -1) {
        blogPost.comments[commentIndex] = {
          ...blogPost.comments[commentIndex].toObject(),
          ...req.body,
        };

        await blogPost.save();
        res.send(blogPost.comments[commentIndex]);
      }
    } else {
      next(createHttpError(404, "Not found"));
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const getOneComment = async (req, res, next) => {
  try {
    // get blogPost
    const blogPost = await BlogPostModel.findById(req.params.postId);
    if (blogPost) {
      const comment = blogPost.comments.find(
        (comment) => comment._id.toString() === req.params.commentId
      );
      comment ? res.send(comment) : next(createHttpError(404, "Not found"));
    } else {
      next(createHttpError(404, "Not found"));
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const getComments = async (req, res, next) => {
  try {
    const blogPost = await BlogPostModel.findById(req.params.postId);
    if (blogPost) {
      res.send(blogPost.comments);
    } else {
      next(createHttpError(404, "Not found"));
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export default {
  postComment,
  deleteComment,
  editComment,
  getOneComment,
  getComments,
};
