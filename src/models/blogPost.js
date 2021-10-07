import mongoose from "mongoose";
const { Schema, model } = mongoose;

const commentSchema = mongoose.Schema({
  asin: String,
  rating: Number,
  text: String,
  user: String,
  commentDate: Date,
});

const blogPostSchema = new Schema(
  {
    category: {
      type: String,
      enum: ["politics", "learning", "history", "life"],
      required: true,
    },
    title: { type: String, required: true },
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
    author: { type: Schema.Types.ObjectId, ref: "User" }, // case sensitive
    content: { type: String, required: false },
    comments: [commentSchema],
    likes: Number,
  },
  {
    timestamps: true,
  }
);

blogPostSchema.static("findBlogPostWithAuthor", async function (mongoQuery) {
  // cannot be an arrow function
  const total = await this.countDocuments(mongoQuery.criteria);
  const posts = await this.find(mongoQuery.criteria, mongoQuery.options.fields)
    .limit(mongoQuery.options.limit || 10)
    .skip(mongoQuery.options.skip)
    .sort(mongoQuery.options.sort)
    .populate({ path: "author" });

  return { total, posts };
});

const BlogPostModel = model("BlogPost", blogPostSchema);
export default BlogPostModel;
