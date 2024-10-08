// models/User.js
const mongoose = require('mongoose');
const newblsSchema = new mongoose.Schema({
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

const newBls = mongoose.model('newBls', newblsSchema);
module.exports = newBls;
