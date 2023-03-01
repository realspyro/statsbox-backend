import mongoose from "mongoose";
const { Schema } = mongoose;
const PostContentSchema = new Schema({
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
const PostImageSchema = new Schema({
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
const PostSchema = new Schema({
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
