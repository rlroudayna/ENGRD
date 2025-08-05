// backend/models/application.js
const mongoose = require('mongoose');

// Assurez-vous que le modèle 'Job' est bien défini et accessible.
// Si vous avez un fichier Job.js, son module.exports doit être mongoose.model('Job', jobSchema);
// Le nom 'Job' ici doit correspondre exactement.
if (!mongoose.models.Job) {
  // Optionnel: Si Job n'est pas encore défini, vous pourriez le require ici,
  // mais normalement il est importé via server.js ou jobRoutes.js
  // console.warn("Attention: Le modèle 'Job' n'est pas encore défini lors de la compilation de 'Application'.");
}

const applicationSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true }, 
  message: { type: String, required: false },
  status: { type: String, required: true }, 
  otherStatus: { type: String, required: false }, 
  cv: { type: String, required: true }, 
  coverLetter: { type: String, required: false }, 
  jobId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job', // ⭐ C'est le nom du modèle que Mongoose doit chercher
    default: null, // Valeur par défaut pour les candidatures spontanées
    required: false // Reste facultatif
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// ⭐ Méthode robuste pour éviter OverwriteModelError et s'assurer que le modèle est unique
// Si le modèle 'Application' existe déjà, on le réutilise. Sinon, on le crée.
module.exports = mongoose.models.Application || mongoose.model('Application', applicationSchema);