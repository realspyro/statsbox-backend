import mongoose from "mongoose";
import { Post, PostContent } from "../models/post.model";

const { Schema } = mongoose;

const PostContentSchema = new Schema<PostContent>({
  type: {
    type: String,
    required: true,
  },
  content: Schema.Types.Mixed,
});

const PostSchema = new Schema<Post>({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  data: {
    type: [PostContentSchema],
    required: true,
  },
  references: {
    type: [String],
    required: true,
  },
});

export default mongoose.model("Post", PostSchema);
