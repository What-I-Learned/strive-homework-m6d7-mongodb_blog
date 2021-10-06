import express from "express";
import createHttpError from "http-errors";
import BlogPostModel from "../../models/blogPost.js";

const blogPostRouter = express.Router();

blogPostRouter.post("/", async (req, res, next) => {
  try {
    const newBlogPost = new BlogPostModel(req.body); // mongoose validation
    const post = await newBlogPost.save();
    console.log(newBlogPost);
    res.status(201).send(post);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

blogPostRouter.get("/", async (req, res, next) => {
  try {
    const blogPosts = await BlogPostModel.find();
    res.send(blogPosts);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

blogPostRouter.get("/:postId", async (req, res, next) => {
  try {
    const blogPost = await BlogPostModel.findById(req.params.postId);
    blogPost
      ? res.send(blogPost)
      : next(
          createHttpError(404, `Post with id ${req.params.postId} not found`)
        );
  } catch (err) {
    console.log(err);
    next(err);
  }
});

blogPostRouter.put("/:postId", async (req, res, next) => {
  try {
    const blogPost = await BlogPostModel.findByIdAndUpdate(
      req.params.postId,
      req.body,
      { new: true } // REMEMBER THIS!!!!!
    );

    blogPost ? res.send(blogPost) : next(createHttpError(404, "Not found"));
  } catch (err) {
    console.log(err);
    next(err);
  }
});

blogPostRouter.delete("/:postId", async (req, res, next) => {
  try {
    const blogPost = await BlogPostModel.findByIdAndDelete(req.params.postId);
    blogPost ? res.send("deleted") : next(createHttpError(404, "not found"));
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// comments
blogPostRouter.post("/:postId", async (req, res, next) => {
  try {
    // find a post to post a comment on
    const blogPost = await BlogPostModel.findById(req.params.postId, {
      _id: 0,
    });
    if (blogPost) {
      console.log("found " + req.params.postId);
      const commentToInsert = {
        ...req.body,
        commentDate: new Date(),
      };

      const updatedBlogPost = await BlogPostModel.findByIdAndUpdate(
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
});

// refactor later
const addComment = async (req, res, next) => {
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

blogPostRouter.get("/:postId/comments", addComment);

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

blogPostRouter.get("/:postId/comments/:commentId", getOneComment);

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

blogPostRouter.put("/:postId/comments/:commentId", editComment);

const deleteComment = async (req, res, next) => {
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
blogPostRouter.put("/:postId/comments/:commentId", deleteComment);

export default blogPostRouter;
