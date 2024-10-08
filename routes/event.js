const express = require('express');
const Event = require('../models/Event');  // Assurez-vous que le chemin vers le modèle est correct
const router = express.Router();
const adminMiddleware = require('../middleware/adminMiddleware');
const verifyToken = require ('../middleware/verifyToken');
// 1. Récupérer tous les événements
router.get('/events',verifyToken, async (req, res) => {
  try {
    const events = await Event.find();  // Récupère tous les événements
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des événements' });
  }
});

// 2. Récupérer un événement par ID
router.get('/retrieve-event/:id',verifyToken, async (req, res) => {
  const { id } = req.params;
  
  try {
    const event = await Event.findById(id);
    
    if (!event) {
      return res.status(404).json({ error: 'Événement non trouvé' });
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'événement' });
  }
});

// 3. Créer un nouvel événement
router.post('/add-event',adminMiddleware, async (req, res) => {
  const { title, description, date, time, location } = req.body;

  // Valider les données entrantes
  if (!title || !description || !date || !time) {
    return res.status(400).json({ error: 'Tous les champs obligatoires doivent être remplis' });
  }

  try {
    const newEvent = new Event({ title, description, date, time, location });
    await newEvent.save();
    res.status(201).json(newEvent);  // Renvoie l'événement créé avec un statut 201
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de l\'événement' });
  }
});

// 4. Mettre à jour un événement par ID
router.put('/update-event/:id',adminMiddleware, async (req, res) => {
  const { id } = req.params;
  const _id = id;
  const { title, description, date, time, location } = req.body;

  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      _id,
      { title, description, date, time, location },
      { new: true }  // Renvoie l'événement mis à jour
    );

    if (!updatedEvent) {
      return res.status(404).json({ error: 'Événement non trouvé' });
    }

    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'événement' });
  }
});

// 5. Supprimer un événement par ID
router.delete('/delete-event/:id',adminMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      return res.status(404).json({ error: 'Événement non trouvé' });
    }

    res.status(200).json({ message: 'Événement supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'événement' });
  }
});

module.exports = router;
