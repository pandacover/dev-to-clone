const router = require("express").Router();
const Post = require("../models/Post");
const authMiddleware = require("../middlewares/auth.middleware");
const { check, validationResult } = require("express-validator");
const { isObjectIdOrHexString } = require("mongoose");

router.post(
	"/add",
	[
		check("title", "The header length is at least 5 characters").isLength({
			min: 5,
		}),
		check(
			"description",
			"Description length of at least 10 characters"
		).isLength({ min: 10 }),
		check("tags", "There should be at least one tag").isLength({ min: 1 }),
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

			const { title, description, tags, coverPhoto } = req.body;
			const newPost = new Post({
				title,
				description,
				tags,
				coverPhoto,
				owner: req.user.id,
			});

			await newPost.save();

			res.status(201).json({ message: "The post is published" });
		} catch (e) {
			res.status(500).json({ message: "server error: " + e.message });
		}
	}
);

router.delete("/delete/:id", authMiddleware, async (req, res) => {
	try {
		const findPost = await Post.findById(req.params.id);

		if (!findPost) {
			return res.status(400).json({ message: "Post not nail" });
		}

		await Post.deleteOne({
			_id: req.params.id,
		});

		res.status(200).json({ message: "The post is deleted" });
	} catch (e) {
		res.status(500).json({ message: "server error: " + e.message });
	}
});

router.put(
	"/change/:id",
	[
		check("title", "The header length is at least 5 characters").isLength({
			min: 5,
		}),
		check(
			"description",
			"Description length of at least 10 characters"
		).isLength({ min: 10 }),
		check("tags", "There should be at least one tag").isLength({ min: 1 }),
	],
	authMiddleware,
	async (req, res) => {
		try {
			const { title, description, tags, coverPhoto } = req.body;
			const findPost = await Post.findById(req.params.id);

			if (!findPost) {
				return res.status(400).json({ message: "Post not nail" });
			}

			await Post.updateOne(
				{
					_id: req.params.id,
				},
				{
					$set: {
						title: title || findPost.title,
						description: description || findPost.description,
						tags: tags || findPost.tags,
						coverPhoto: coverPhoto || findPost.coverPhoto,
						createdAt: new Date(),
					},
				}
			);

			res.status(200).json({ message: "Post -changed" });
		} catch (e) {
			res.status(500).json({ message: "server error: " + e.message });
		}
	}
);

router.get("/", authMiddleware, async (req, res) => {
	try {
		const posts = await Post.find();

		res.status(200).json(posts);
	} catch (e) {
		res.status(500).json({ message: "server error: " + e.message });
	}
});

router.get("/:id", authMiddleware, async (req, res) => {
	try {
		const findPost = await Post.findById(req.params.id);

		if (!findPost) {
			return res.status(400).json({ message: "Post not Found" });
		}

		res.status(200).json(findPost);
	} catch (e) {
		res.status(500).json({ message: "server error: " + e.message });
	}
});

router.get("/owner/:id", authMiddleware, async (req, res) => {
	try {
		const findPost = await Post.find({ owner: req.params.id });

		if (!findPost) {
			return res.status(400).json({ message: "Cannot get the post" });
		}

		res.status(200).json(findPost);
	} catch (e) {
		res.status(500).json({ message: "server error: " + e.message });
	}
});

router.put("/like/:id", authMiddleware, async (req, res) => {
	try {
		const findPost = await Post.findById(req.params.id);
		if (!findPost) {
			return res.status(404).json({ message: "Post not found" });
		}
		let likes = [],
			flag = false;
		findPost.likes.forEach((data) => {
			if (String(data) !== req.user.id) {
				likes.unshift(data);
			} else {
				flag = true;
			}
		});

		if (!flag) likes.unshift(req.user.id);

		await Post.updateOne(
			{ _id: findPost.id },
			{
				$set: {
					likes: likes,
					createdAt: new Date(),
				},
			}
		);
		res.status(201).json({ message: "post liked" });
	} catch (e) {
		res.status(500).json({ message: "server error: " + e.message });
	}
});

module.exports = router;
