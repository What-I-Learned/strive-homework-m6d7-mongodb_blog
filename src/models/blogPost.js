import mongoose from "mongoose";
const { Schema, model } = mongoose;

const blogPostSchema = new Schema(
  {
    category: {
      type: String,
    },
    title: {
      type: String,
    },
    cover: { type: String },
    readTime: {
      value: {
        type: Number,
      },
      unit: {
        type: String,
      },
    },
    author: {
      name: { type: String },
      avatar: { type: String },
    },
    content: String,
  },
  { timeStamps: true }
);
export default model("BlogPost", blogPostSchema);
