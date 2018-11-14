import mongoose from "mongoose";

const Schema = mongoose.Schema;

const feedSchema = new Schema({
  title: { type: String, required: true },
  createDate: { type: Date, default: Date.now },
  content: { type: String, required: true },
  creator: { type: Schema.Types.ObjectId, ref: "User" }
});

const Feed = mongoose.model("feed", feedSchema, "feed");

export default Feed;
