// routes/auth.js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const emailValidator = require("../middleware/EmailValidator");
const router = express.Router();
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET; // Replace with your own secret key

// Register
router.post("/register", emailValidator, async (req, res) => {
	const { name, email, password } = req.body;

	// Simple validation
	if (!name || !email || !password) {
		return res
			.status(400)
			.json({ message: "All the fields are required." });
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
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ message: "Invalid credentials." });
		}

		// Compare passwords
		if (user) {
			const isMatch = user.comparePassword(password);
			if (!isMatch) {
				return res.status(400).json({ message: "Invalid credentials." });
			}
		}
		// Generate JWT
		const token = jwt.sign({ userId: user._id,  role: user.role }, JWT_SECRET, {
			expiresIn: "1h",
		}); // Token expires in 1 hour
		res.json({ token });
	} catch (error) {
		console.log(error)
		return res.status(500).json({ message: "Server error." });
	}
});


module.exports = router;
