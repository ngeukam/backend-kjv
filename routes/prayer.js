const express = require('express');
const Prayer = require('../models/Prayer'); // Assurez-vous que le chemin est correct pour votre modèle
const router = express.Router();
const adminMiddleware = require('../middleware/adminMiddleware');
const verifyToken = require ('../middleware/verifyToken');
// Route pour obtenir toutes les prières
router.get('/prayers',verifyToken, async (req, res) => {
  try {
    const prayers = await Prayer.find(); // Récupère toutes les prières
    res.status(200).json(prayers); // Renvoie la réponse en format JSON
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des prières', error });
  }
});

// Route pour obtenir une prière spécifique par ID
router.get('/retrieve-prayer/:id',verifyToken, async (req, res) => {
  try {
    const prayer = await Prayer.findById(req.params.id);
    if (!prayer) {
      return res.status(404).json({ message: 'Prière non trouvée' });
    }
    res.status(200).json(prayer);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de la prière', error });
  }
});

// Route pour ajouter une nouvelle prière
router.post('/add-prayer',adminMiddleware, async (req, res) => {
  const { title, description, author } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: 'Le titre et la description sont requis' });
  }

  try {
    const newPrayer = new Prayer({
      title,
      description,
      author,
    });
    const savedPrayer = await newPrayer.save(); // Sauvegarde dans la base de données
    res.status(201).json(savedPrayer);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'ajout de la prière', error });
  }
});

// Route pour mettre à jour une prière existante par ID
router.put('/update-prayer/:id',adminMiddleware, async (req, res) => {
  const { title, description, author } = req.body;

  try {
    const updatedPrayer = await Prayer.findByIdAndUpdate(
      _id=req.params.id,
      { title, description, author },
      { new: true, runValidators: true }
    );

    if (!updatedPrayer) {
      return res.status(404).json({ message: 'Prière non trouvée' });
    }

    res.status(200).json(updatedPrayer);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la prière', error });
  }
});

// Route pour supprimer une prière par ID
router.delete('/delete-prayer/:id',adminMiddleware, async (req, res) => {
  try {
    const deletedPrayer = await Prayer.findByIdAndDelete(req.params.id);

    if (!deletedPrayer) {
      return res.status(404).json({ message: 'Prière non trouvée' });
    }

    res.status(200).json({ message: 'Prière supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de la prière', error });
  }
});

module.exports = router;
