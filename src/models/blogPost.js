import mongoose from "mongoose";
const { Schema, model } = mongoose;

const blogPostSchema = new Schema(
  {
    category: { type: String, required: false },
    title: { type: String, required: false },
    cover: { type: String, required: false },
    readTime: {
      type: Object,
      value: {
        type: Number,
        required: false,
      },
      unit: {
        type: String,
        required: false,
      },
    },
    author: {
      type: Object,
      name: {
        type: String,
        required: false,
      },
      avatar: {
        type: String,
        required: false,
      },
    },
    content: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);
export default model("BlogPost", blogPostSchema);
