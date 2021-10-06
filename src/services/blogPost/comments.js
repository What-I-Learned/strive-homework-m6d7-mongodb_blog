import BlogPostModel from "../../models/blogPost.js";

export const deleteComment = async (req, res, next) => {
  try {
    // get blogPost
    const blogPost = await BlogPostModel.findByIdAndUpdate(
      req.params.postId,
      { $pull: { comments: { _id: req.params.commentId } } }, // HOW
      { new: true } // options
    );
    if (blogPost) {
      res.send(blogPost);
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

export const editComment = async (req, res, next) => {
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
        res.send(blogPost[commentIndex]);
      }
    } else {
      next(createHttpError(404, "Not found"));
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const getOneComment = async (req, res, next) => {
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

export const getComments = async (req, res, next) => {
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
  deleteComment,
  editComment,
  getOneComment,
  getComments,
};
