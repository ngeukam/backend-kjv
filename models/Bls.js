// models/User.js
const mongoose = require('mongoose');
const blsSchema = new mongoose.Schema({
  book: {
    type: String,
    required: true,
  },
  chapter: {
    type: String,
    required: true,
  },
  verse: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
 
});

const Bls = mongoose.model('Bls', blsSchema);
module.exports = Bls;
