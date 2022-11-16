const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const authMiddleware = require("../middlewares/auth.middleware");
const { check, validationResult } = require("express-validator");

router.delete("/delete/:id", authMiddleware, async (req, res) => {
	try {
		const findUser = await User.findById(req.params.id);
		const findPosts = await Post.find({ owner: req.params.id });

		if (!findUser) {
			return res.status(404).json({ message: "User is not found" });
		}

		if (findPosts.length) {
			await Post.deleteMany({
				owner: req.params.id,
			});
		}

		await User.deleteOne({
			_id: findUser._id,
		});
	} catch (e) {
		res.status(500).json({ message: "Error" });
	}
});

router.put(
	"/change/:id",
	[
		check("name", "Name length is at least 2 characters").isLength({ min: 2 }),
		check("email", "Incorrect mail").isEmail(),
		check("city", "City length is at least 2 characters").isLength({ min: 2 }),
		check("bio", "Biography length is at least 10 characters").isLength({
			min: 10,
		}),
		check(
			"skills",
			"The length of the skills is at least 2 characters"
		).isLength({ min: 2 }),
		check("work", "Work length is at least 2 characters").isLength({ min: 2 }),
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

			const { name, email, avatar, city, bio, skills, work } = req.body;
			const findUser = await User.findById(req.params.id);
			const someUser = await User.findOne({ email });

			if (!findUser) {
				return res.status(404).json({ message: "User is not found" });
			}

			if (someUser) {
				return res
					.status(404)
					.json({ message: "The user with this mail already exists" });
			}

			await User.updateOne(
				{
					_id: req.params.id,
				},
				{
					$set: {
						name: name || findUser.name,
						email: email || findUser.email,
						avatar: avatar || findUser.avatar,
						city: city || findUser.city,
						bio: bio || findUser.bio,
						skills: skills || findUser.skills,
						work: work || findUser.work,
					},
				}
			);

			res.status(200).json({ message: "The user is changed" });
		} catch (e) {
			res.status(500).json({ message: "Error" });
		}
	}
);

router.get("/", authMiddleware, async (req, res) => {
	try {
		const users = await User.find();
		res.status(200).json({ users });
	} catch (e) {
		res.status(500).json({ message: "Error" });
	}
});

router.get("/:id", authMiddleware, async (req, res) => {
	try {
		const findUser = await User.findById(req.params.id);
		res.status(200).json({ findUser });
	} catch (e) {
		res.status(500).json({ message: "Error" });
	}
});

module.exports = router;
