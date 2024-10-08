const mongoose = require('mongoose');

// Schéma pour l'événement
const prayerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,  // Enlève les espaces inutiles
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: String, // Peut être stocké sous forme de chaîne (ex: '10:00 AM')
    required: false,
  },
  created_at: {
    type: Date,
    default: Date.now, // Ajoute la date de création par défaut
  }
});

// Modèle pour l'événement
const Prayer = mongoose.model('Prayer', prayerSchema);

module.exports = Prayer;
