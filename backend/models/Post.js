const { Schema, model, Types } = require("mongoose");

const schema = new Schema({
	title: { type: String, required: true },
	description: { type: String, required: true },
	createdAt: { type: Date, required: true, default: Date.now },
	owner: { type: Types.ObjectId, ref: "user" },
	likes: { type: Array(Types.ObjectId), ref: "user", default: [] },
	comments: [{ type: Types.ObjectId, ref: "comment" }],
	coverPhoto: { type: String },
	photos: [{ type: String }],
	tags: [{ type: String, required: true }],
});

module.exports = model("post", schema);
