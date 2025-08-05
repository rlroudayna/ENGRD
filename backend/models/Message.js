// backend/models/Message.js
const mongoose = require('mongoose');

// C'est le "plan" pour un message de contact
const messageSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Le nom de la personne qui envoie le message
  email: { type: String, required: true }, // Son adresse e-mail
  subject: { type: String, required: true }, // Le sujet du message
  message: { type: String, required: true }, // Le contenu du message
  createdAt: { type: Date, default: Date.now }, // La date et l'heure d'envoi du message
});

// Nous "fabriquons" le modèle Message à partir de ce plan
module.exports = mongoose.model('Message', messageSchema);