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

export default blogPostRouter;
