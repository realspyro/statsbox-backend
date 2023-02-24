import mongoose from "mongoose";
import { title } from "process";
import { Post, PostContent, PostImage } from "../models/post.model";

const { Schema } = mongoose;

const PostContentSchema = new Schema<PostContent>({
  type: {
    type: String,
    required: true,
  },
  content: Schema.Types.Mixed,
});

const PostImageSchema = new Schema<PostImage>({
  url: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
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
  thumbnail: {
    type: PostImageSchema,
    required: true,
  },
});

export default mongoose.model("Post", PostSchema);
