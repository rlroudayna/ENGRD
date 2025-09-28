// backend/routes/homeContentRoutes.js
const express = require('express');
const router = express.Router();
const HomeContent = require('../models/HomeContent');

// Public route to get home content
router.get('/', async (req, res) => {
  try {
    console.log('Fetching all home content from database...');
    const content = await HomeContent.find().select('-__v').sort({ section: 1 });
    
    if (!content || content.length === 0) {
      console.log('No home content found in database');
      return res.status(404).json({ 
        success: false,
        message: 'Aucun contenu trouvé' 
      });
    }
    
    console.log(`Successfully retrieved ${content.length} content sections`);
    res.status(200).json({
      success: true,
      data: content,
      count: content.length
    });
  } catch (err) {
    console.error("Erreur backend GET /api/home-content:", err);
    res.status(500).json({ 
      success: false,
      message: err.message || 'Erreur lors de la récupération du contenu'
    });
  }
});

// Public route to get specific section content
router.get('/:section', async (req, res) => {
  try {
    const { section } = req.params;
    console.log(`Fetching content for section: ${section}`);
    
    const content = await HomeContent.findOne({ section }).select('-__v');
    if (!content) {
      console.log(`Section not found: ${section}`);
      return res.status(404).json({ 
        success: false,
        message: 'Section non trouvée' 
      });
    }
    
    console.log(`Successfully retrieved content for section: ${section}`);
    res.status(200).json({
      success: true,
      data: content
    });
  } catch (err) {
    console.error("Erreur backend GET /api/home-content/:section:", err);
    res.status(500).json({ 
      success: false,
      message: err.message || 'Erreur lors de la récupération de la section'
    });
  }
});

module.exports = router;