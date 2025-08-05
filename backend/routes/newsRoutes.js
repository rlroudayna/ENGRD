// backend/routes/newsRoutes.js
const express = require('express');
const router = express.Router();
const News = require('../models/News'); // Importe le modèle News

// Route publique pour obtenir toutes les actualités (triées par la plus récente)
router.get('/', async (req, res) => {
  try {
    const news = await News.find().sort({ publishedAt: -1 });
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ⭐ NOUVEAU : Route publique pour obtenir une actualité par son ID
router.get('/:id', async (req, res) => {
  try {
    const newsItem = await News.findById(req.params.id); // Cherche l'actualité par son ID
    if (!newsItem) {
      return res.status(404).json({ message: 'Actualité non trouvée' }); // Si non trouvée
    }
    res.json(newsItem); // Renvoie l'actualité trouvée
  } catch (err) {
    // Gère les erreurs, par exemple si l'ID n'est pas valide
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;