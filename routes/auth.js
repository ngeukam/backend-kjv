// routes/auth.js
const express = require("express");
//const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const emailValidator = require("../middleware/EmailValidator");
const router = express.Router();
require("dotenv").config();
const bcrypt = require("bcryptjs"); // Import bcryptjs

const JWT_SECRET = process.env.JWT_SECRET; // Replace with your own secret key

// Register
router.post("/register", emailValidator, async (req, res) => {
	const { name, email, password } = req.body;
	// Simple validation
	if (!name || !email || !password) {
		return res.status(400).json({ message: "All the fields are required." });
	}

	// Check if user already exists
	const existingUser = await User.findOne({ email });
	if (existingUser) {
		return res.status(400).json({ message: "Email already exists." });
	}
	// Hash the password
	const hashedPassword = await bcrypt.hash(password, 10);
	const newUser = new User({ name, email, password: hashedPassword });
	await newUser.save();

	res.status(201).json({ message: "User registered successfully." });
});

// Login
router.post("/login", async (req, res) => {
	try {
		const { body } = req;
		if (body.email && body.password) {
			const email = body?.email?.trim().toLowerCase()
			const user = await User.findOne({ email });
			if (user) {
				const auth =  await bcrypt.compare(body.password, user.password);
				console.log(auth);
				if (auth) {
					user.password = undefined;
					const token = jwt.sign(
						{ userId: user._id, role: user.role },
						JWT_SECRET,
						{
							expiresIn: "365days",
						}
					);
					res.json({ token });
				} else {
					return res.status(401).send({
						error: true,
						msg: "Invalid credentials",
					});
				}
			}
			return res.status(404).json({
				error: true,
				msg: "User not found",
			});
		}
		return res.status(404).json({
			error: true,
			msg: "Wrong Credentials",
		});
	} catch (e) {
		return res.status(500).send({
			error: true,
			msg: "Server failed",
		});
	}
});

module.exports = router;
