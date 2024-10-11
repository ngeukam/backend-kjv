const express = require('express');
const router = express.Router();
const Form = require('../models/forms');
const adminMiddleware = require('../middleware/adminMiddleware');
const verifyToken = require('../middleware/verifyToken');

// Créer un formulaire
router.post('/form',adminMiddleware, async (req, res) => {
  const { body1, body2, body3 } = req.body;
  const form = new Form({ body1, body2, body3 });
  try {
    await form.save();
    res.status(201).send(form);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Obtenir les formulaires existants
router.get('/forms',verifyToken, async (req, res) => {
  try {
    const forms = await Form.find();
    res.status(200).send(forms);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.put('/form/:id',adminMiddleware, async (req, res) => {
    const { id } = req.params; // Get the form ID from the URL parameters
    const { body1, body2, body3 } = req.body; // Get updated values from the request body
  
    // Validate input
    if (!body1 || !body2 || !body3) {
      return res.status(400).send({ error: 'All fields are required' });
    }
  
    try {
      // Find the form by ID and update it
      const form = await Form.findByIdAndUpdate(id, { body1, body2, body3 }, { new: true, runValidators: true });
  
      // Check if the form exists
      if (!form) {
        return res.status(404).send({ error: 'Form not found' });
      }
  
      // Return the updated form
      res.status(200).send(form);
    } catch (error) {
      // Handle validation errors
      if (error.name === 'ValidationError') {
        return res.status(400).send({ error: error.message });
      }
      // Handle other errors
      res.status(500).send({ error: 'Server error' });
    }
  });

  // Get a single form by ID
router.get('/form/:id',verifyToken, async (req, res) => {
    const { id } = req.params; // Get the form ID from the URL parameters
    try {
      // Find the form by ID
      const form = await Form.findById(id);
  
      // Check if the form exists
      if (!form) {
        return res.status(404).send({ error: 'Form not found' });
      }
  
      // Return the found form
      res.status(200).send(form);
    } catch (error) {
      // Handle errors (e.g., invalid ID format)
      res.status(500).send({ error: 'Server error' });
    }
  });
  
module.exports = router;
