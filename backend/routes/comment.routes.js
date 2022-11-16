const router = require("express").Router();
const authMiddleware = require("../middlewares/auth.middleware");
const Comment = require("../models/comment");
const { check, validationResult } = require("express-validator");
const Post = require("../models/Post");

router.post(
	"/add/:id",
	[
		check("text", "The message should have at least 6 characters").isLength({
			min: 6,
		}),
	],
	authMiddleware,
	async (req, res) => {
		try {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return res.status(400).json({
					errors: errors.array(),
					message: "Incorrect data",
				});
			}

			const findPost = await Post.findById(req.params.id);
			const { text } = req.body;

			const newComment = new Comment({
				text,
				owner: req.user.id,
				post: findPost._id,
			});

			await newComment.save();

			res.status(201).json({ message: "Comment published" });
		} catch (e) {
			res.status(500).json({ message: "Server error" });
		}
	}
);

router.delete("/delete/:id", authMiddleware, async (req, res) => {
	try {
		const findComment = await Comment.findById(req.params.id);

		if (!findComment) {
			return res.status(404).json({ message: "Such a comment does not exist" });
		}

		await Comment.deleteOne({
			_id: findComment._id,
		});

		res.status(201).json({ message: "Comment has been deleted" });
	} catch (e) {
		res.status(500).json({ message: "server error" });
	}
});

router.put("/change/:id", authMiddleware, async (req, res) => {
	try {
		const { text } = req.body;
		const findComment = await Comment.findById(req.params.id);

		if (!findComment) {
			return res.status(404).json({ message: "Such a comment does not exist" });
		}

		await Comment.updateOne(
			{ _id: findComment.id },
			{ $set: { text, createdAt: new Date() } }
		);

		res.status(201).json({ message: "The comment is changed" });
	} catch (e) {
		res.status(500).json({ message: "server error" });
	}
});

router.get("/", authMiddleware, async (req, res) => {
	try {
		const comments = await Comment.find();
		res.status(201).json({ comments });
	} catch (e) {
		res.status(500).json({ message: "server error" });
	}
});

router.get("/post/:id", authMiddleware, async (req, res) => {
	try {
		const comments = await Comment.find({ post: req.params.id });
		res.status(201).json({ comments });
	} catch (e) {
		res.status(500).json({ message: "server error" });
	}
});

router.get("/:id", authMiddleware, async (req, res) => {
	try {
		const findComment = await Comment.findById(req.params.id);
		res.status(201).json({ findComment });
	} catch (e) {
		res.status(500).json({ message: "Server error" });
	}
});

module.exports = router;
