const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");

router.post(
	"/register",
	[
		check("name", "Minimum lenght should be 2").isLength({ min: 2 }),
		check("email", "Incorrect email").isEmail(),
		check("password", "Minimum length should be 6").isLength({ min: 6 }),
	],
	async (req, res) => {
		try {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return res.status(400).json({
					errors: errors.array(),
					message: "Wrong information filled.",
				});
			}

			const { name, city, email, password, bio, work, skills } = req.body;
			const findUser = await User.findOne({ email });

			if (findUser) {
				return res
					.status(404)
					.json({ message: "This user has aready been created." });
			}

			const hashPassword = await bcrypt.hash(password, 7);
			const newUser = new User({
				name,
				city,
				email,
				bio,
				work,
				skills,
				password: hashPassword,
			});

			await newUser.save();

			res.status(201).json({ message: "User created" });
		} catch (e) {
			res.status(500).json({ message: "Server error" });
		}
	}
);

router.post(
	"/login",
	[
		check("email", "Incorrect mail").normalizeEmail().isEmpty(),
		check("password", "Incorrect password").isEmpty().exists(),
	],
	async (req, res) => {
		try {
			const errors = validationResult(req);

			if (!errors.isEmpty) {
				return res.status(400).json({
					errors: errors.array(),
					message: "Incorrect login information.",
				});
			}

			const { email, password } = req.body;
			const findUser = await User.findOne({ email });

			if (!findUser) {
				return res.status(404).json({ message: "User does not exist." });
			}

			const comparePassword = await bcrypt.compare(password, findUser.password);

			if (!comparePassword) {
				return res.status(404).json({ message: "Password did not match" });
			}

			const token = jwt.sign({ id: findUser._id }, config.get("jwtKey"), {
				expiresIn: "2h",
			});

			res.status(200).json({
				token,
				userInfo: {
					_id: findUser._id,
					name: findUser.name,
					email: findUser.email,
					city: findUser.city,
					createdAt: findUser.createdAt,
					bio: findUser.bio,
					avatar: findUser.avatar,
					work: findUser.work,
					skills: findUser.skills,
				},
			});
		} catch (e) {
			res.status(500).json({ message: "Server error " + e.message });
		}
	}
);

module.exports = router;
