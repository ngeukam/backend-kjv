const mongoose = require('mongoose');

// Schéma pour l'événement
const eventSchema = new mongoose.Schema({
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
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String, // Peut être stocké sous forme de chaîne (ex: '10:00 AM')
    required: true,
  },
  location: {
    type: String,  // Pour ajouter l'emplacement de l'événement
    required: false,
  },
  created_at: {
    type: Date,
    default: Date.now, // Ajoute la date de création par défaut
  }
});

// Modèle pour l'événement
const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
