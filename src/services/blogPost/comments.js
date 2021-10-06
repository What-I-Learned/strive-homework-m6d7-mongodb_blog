import express from "express";
import createHttpError from "http-errors";
import BlogPostModel from "../../models/blogPost.js";

const commentRouter = express.Router();

commentRouter.post("/:postId", async (req, res, next) => {
  try {
    //   1. find post by id
    const blogPost = await BlogPostModel.findById(req.body.blogPostId, {
      _id: 0,
    }); // projection
    if (blogPost) {
      console.log(blogPost);
      // 2. add a comment to the blog
      // blogPost is a mongoose document not a normalObject therefore we need to parse it
      const commentToInsert = {
        ...blogPost.toObject(),
        commentDate: new Date(),
      };
      //   3.update the specified record by pushing comment to the history
      const updatedBlogPost = await BlogPostModel.findByIdAndUpdate(
        req.params.postId, // what to modify
        { $push: { commentHistory: commentToInsert } }, // how to modify
        { new: true }
      );

      updatedBlogPost
        ? res.send(updatedBlogPost)
        : next(createHttpError(404, "Not found"));
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});

commentRouter.get("/", async (req, res, next) => {
  try {
  } catch (err) {
    console.log(err);
    next(err);
  }
});

commentRouter.get("/", async (req, res, next) => {
  try {
  } catch (err) {
    console.log(err);
    next(err);
  }
});

commentRouter.put("/", async (req, res, next) => {
  try {
  } catch (err) {
    console.log(err);
    next(err);
  }
});

commentRouter.delete("/", async (req, res, next) => {
  try {
  } catch (err) {
    console.log(err);
    next(err);
  }
});

export default commentRouter;
