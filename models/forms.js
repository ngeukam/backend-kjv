const mongoose = require("mongoose");

const formSchema = new mongoose.Schema({
	body1: { type: String, required: false, trim: true },
    body2: { type: Map, of: [String], required: false }, // Assurez-vous que body2 est un Map
    body3: { type: String, required: false, trim: true },
});

module.exports = mongoose.model("Form", formSchema);
