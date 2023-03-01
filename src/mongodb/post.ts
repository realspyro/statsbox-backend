import mongoose from "mongoose";
import { title } from "process";
import { Post, PostContent, PostImage } from "../models/post.model";

const { Schema } = mongoose;

const PostContentSchema = new Schema<PostContent>({
  type: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: Schema.Types.Mixed,
    trim: true,
    required: true,
  },
});

const PostImageSchema = new Schema<PostImage>({
  url: {
    type: String,
    required: true,
    trim: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
});

const PostSchema = new Schema<Post>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  data: {
    type: [PostContentSchema],
    required: true,
    trim: true,
  },
  references: {
    type: [String],
    required: true,
    trim: true,
  },
  thumbnail: {
    type: PostImageSchema,
    required: true,
    trim: true,
  },
});

export default mongoose.model("Post", PostSchema);
