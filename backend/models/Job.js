// backend/models/Job.js
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: String,
  description: String,
  location: String,
  // Mise à jour pour inclure "CDD" dans la liste des types de contrats autorisés
  type: {
    type: String,
    enum: ['CDI', 'CDD', 'Freelance', 'Stage'], // Utilisation d'une énumération pour une meilleure validation
    required: true
  },
  postedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Job', jobSchema);
