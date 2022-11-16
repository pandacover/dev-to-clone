const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = async function (req, res, next) {
	if (req.method === "OPTIONS") {
		return next();
	}

	try {
		const token = req.headers.authorization.split(" ")[1];

		if (!token) {
			return res.status(401).json({ message: "Authentication failed." });
		}

		const decoded = jwt.verify(token, config.get("jwtKey"));
		req.user = decoded;

		next();
	} catch (e) {
		res.status(401).json({ message: "Authentication failed." });
	}
};
