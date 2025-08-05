// backend/models/News.js
const mongoose = require('mongoose');

// C'est le "plan" pour une actualité
const newsSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Le titre de l'actualité
  content: { type: String, required: true }, // Le contenu de l'actualité
  imageUrl: { type: String }, // Une image (ce n'est pas obligatoire, donc pas 'required')
  publishedAt: { type: Date, default: Date.now }, // La date de publication de l'actualité
});

// Nous "fabriquons" le modèle News à partir de ce plan
module.exports = mongoose.model('News', newsSchema);