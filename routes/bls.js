const express = require("express");
const Bls = require("../models/Bls");
const router = express.Router();

// create bls
router.post("/create-verse", async (req, res) => {
	const { book, chapter, verse, text } = req.body;

	// Simple validation
	if (!book || !chapter || !verse || !text) {
		return res
			.status(400)
			.json({ message: "All fields are required." });
	}

	try {
		// Check if verse already exists in the book and chapter
		const existingBls = await Bls.findOne({ book, chapter, verse });
		if (existingBls) {
			return res.status(400).json({ message: "This verse already exists." });
		}

		// Create a new Bls entry
		const newVerse = new Bls({ book, chapter, verse, text });
		await newVerse.save();

		res.status(201).json({ message: "Verse added successfully." });
	} catch (error) {
		// Error handling for any failure during the database operation
		res.status(500).json({ message: "Server error. Please try again.", error });
	}
});

// Get all verses or filter by book, chapter, and/or verse
router.get("/retrieve-verse", async (req, res) => {
  try {
    const { book, chapter, verse } = req.query;

    // Build a query object based on the query parameters
    let query = {};
    if (book) query.book = book;
    if (chapter) query.chapter = chapter;
    if (verse) query.verse = verse;

    // Find all verses matching the query, exclude _id and __v fields
    const foundVerses = await Bls.find(query).select("-__v");

    if (foundVerses.length === 0) {
      return res.status(404).json({ message: "No verses found." });
    }

    // Return the found verses
    res.status(200).json(foundVerses);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
});

router.delete("/delete-verse/:id", async (req, res) => {
    const { id } = req.params;

    try {
        // Vérifiez si le verset existe
        const verseToDelete = await Bls.findById(id);
        if (!verseToDelete) {
            return res.status(404).json({ message: "No verses found." });
        }

        // Supprimez le verset
        await Bls.findByIdAndDelete(id);

        res.status(200).json({ message: "Verse successfully deleted." });
    } catch (error) {
        console.error("Error deleting verse:", error);
        res.status(500).json({ message: "Server error." });
    }
});

// Update a verse by ID
router.put("/update-verse/:id", async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters
    const { book, chapter, verse, text } = req.body; // Extract data from the request body

    try {
        // Check if the verse exists
        const existingVerse = await Bls.findById(id);
        if (!existingVerse) {
            return res.status(404).json({ message: "Verse not found." });
        }

        // Update the verse details
        existingVerse.book = book;
        existingVerse.chapter = chapter;
        existingVerse.verse = verse;
        existingVerse.text = text;

        // Save the updated verse
        await existingVerse.save();

        res.status(200).json({ message: "Verse successfully updated." });
    } catch (error) {
        console.error("Error updating verse:", error);
        res.status(500).json({ message: "Server error." });
    }
});

module.exports = router;
