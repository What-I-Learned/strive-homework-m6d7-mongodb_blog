import express from "express";
import createHttpError from "http-errors";
import BlogPostModel from "../../models/blogPost.js";
import UserModel from "../../models/user.js";
import comments from "./comments.js";
import q2m from "query-to-mongo";

const { deleteComment, editComment, getOneComment, getComments, postComment } =
  comments;

const blogPostRouter = express.Router();

blogPostRouter.post("/", async (req, res, next) => {
  try {
    const newBlogPost = new BlogPostModel(req.body); // mongoose validation
    const post = await newBlogPost.save();

    // find author by id
    await UserModel.findByIdAndUpdate(
      post.author._id.toString(),
      { $push: { posts: newBlogPost } },
      { new: true }
    );

    res.status(201).send(post);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

blogPostRouter.get("/", async (req, res, next) => {
  try {
    const mongoQuery = q2m(req.query);
    const blogPosts = await BlogPostModel.findBlogPostWithAuthor(mongoQuery);

    res.send(blogPosts);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

blogPostRouter.get("/:postId", async (req, res, next) => {
  try {
    const blogPost = await BlogPostModel.findById(req.params.postId)
      .populate({
        path: "author",
        select: "name last_name",
      })
      .populate({ path: "likes", select: "name last_name" });
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
blogPostRouter.post("/:postId", postComment);

blogPostRouter.get("/:postId/comments", getComments);

blogPostRouter.get("/:postId/comments/:commentId", getOneComment);

blogPostRouter.put("/:postId/comments/:commentId", editComment);

blogPostRouter.delete("/:postId/comments/:commentId", deleteComment);

//likes
blogPostRouter.post("/:postId/addLike", async (req, res, next) => {
  try {
    // check if the post exists
    const isLiked = await BlogPostModel.findOne({
      _id: req.params.postId.toString(),
      likes: req.body.liked_by,
    });
    console.log(req.body.liked_by);
    if (isLiked) {
      // for learning purposes
      // console.log("is liked");
      // const find_id = await BlogPostModel.findById(req.params.postId);
      // const like_index = find_id.likes.findIndex(
      //   (i) => i._id.toString() === req.body.liked_by
      // );
      // console.log(like_index);
      const like_update = await BlogPostModel.findByIdAndUpdate(
        req.params.postId,
        { $pull: { likes: req.body.liked_by } },
        { new: true }
      );
      res.send(like_update);
    } else {
      console.log("not liked before");

      const newLike = await UserModel.findById(req.body.liked_by);
      console.log(newLike);

      await BlogPostModel.findByIdAndUpdate(
        req.params.postId,
        { $push: { likes: req.body.liked_by } },
        { new: true }
      );
      res.send("worked");
    }
  } catch (err) {
    next(err);
  }
});

export default blogPostRouter;
