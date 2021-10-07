import express from "express";
import createHttpError from "http-errors";
import BlogPostModel from "../../models/blogPost.js";
import UserModel from "../../models/user.js";
import models from "../../models/blogPost.js";

const userRouter = express.Router();

userRouter.get("/", async (req, res, next) => {
  try {
    const user = await UserModel.find().populate({ path: "posts" });
    res.send(user);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

userRouter.get("/:userID", async (req, res, next) => {
  try {
    const singleUser = await UserModel.findById(req.params.userID);
    singleUser
      ? res.send(singleUser)
      : next(
          createHttpError(404, `User with Id ${req.params.userID} not found`)
        );
  } catch (err) {
    console.log(err);
    next(err);
  }
});

userRouter.post("/", async (req, res, next) => {
  try {
    const newUser = new UserModel({ ...req.body, created: new Date() });
    await newUser.save();
    res.send("Created");
  } catch (err) {
    console.log(err);
    next(err);
  }
});

userRouter.put("/:userID", async (req, res, next) => {
  try {
  } catch (err) {
    console.log(err);
    next(err);
  }
});

userRouter.delete("/:userID", async (req, res, next) => {
  try {
  } catch (err) {
    console.log(err);
    next(err);
  }
});

export default userRouter;
