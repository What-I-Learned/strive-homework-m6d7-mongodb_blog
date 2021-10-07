import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: false },
  last_name: { type: String, required: false },
  email: { type: String, required: false }, // validate
  country: { type: String, required: false },
  age: { type: Number, required: false },
  posts: [{ type: Schema.Types.ObjectId, ref: "BlogPost" }],
  created: Date,
});
export default model("User", userSchema);
