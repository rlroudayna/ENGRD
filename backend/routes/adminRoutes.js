// backend/routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const Application = require("../models/application");
const Message = require("../models/Message");
const News = require("../models/News");

// Middleware d'authentification (simple pour l'exemple, à remplacer par une vraie logique)
const isAuthenticated = (req, res, next) => {
  // Pour le moment, on simule que l'admin est toujours connecté.
  // REMPLACEZ CECI PAR VOTRE VRAIE LOGIQUE D'AUTHENTIFICATION !
  const isAdminLoggedIn = true; 
  if (isAdminLoggedIn) {
    next();
  } else {
    res.status(401).json({ message: 'Accès non autorisé. Veuillez vous connecter.' });
  }
};

router.use(isAuthenticated);

// --- Routes pour les Offres d'Emploi ---

router.get('/jobs', async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (err) {
    console.error("Erreur backend GET /api/admin/jobs:", err);
    res.status(500).json({ error: 'Erreur lors de la récupération des offres.' });
  }
});

router.post('/jobs', async (req, res) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json(job);
  } catch (err) {
    console.error("Erreur backend POST /api/admin/jobs:", err);
    res.status(500).json({ error: err.message });
  }
});

router.put("/jobs/:id", async (req, res) => {
  try {
    const updated = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    console.error("Erreur backend PUT /api/admin/jobs/:id:", err);
    res.status(500).json({ error: err.message });
  }
});

router.delete("/jobs/:id", async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Offre supprimée" });
  } catch (err) {
    console.error("Erreur backend DELETE /api/admin/jobs/:id:", err);
    res.status(500).json({ error: err.message });
  }
});

// --- Routes pour les Candidatures ---

// ⭐ MODIFICATION IMPORTANTE : Utilise .populate('job') pour obtenir les détails de l'offre liée
router.get("/applications", async (req, res) => {
  try {
    // Trouve toutes les candidatures et "remplit" le champ 'job' avec les détails de l'offre
    // Si jobId est null (candidature spontanée), 'job' restera null
     const apps = await Application.find().populate({
      path: 'job', // Le chemin à peupler
      strictPopulate: false // ⭐ Permet de peupler même si le chemin n'est pas toujours dans le schéma ou s'il y a des incohérences.
    }); 
    res.status(200).json(apps);
  } catch (err) {
    console.error("Erreur backend GET /api/admin/applications:", err);
    res.status(500).json({ error: 'Erreur lors de la récupération des candidatures.' });
  }
});

// ⭐ NOUVEAU : Supprimer une candidature (si ce n'était pas déjà là)
router.delete("/applications/:id", async (req, res) => {
  try {
    const result = await Application.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Candidature non trouvée' });
    res.json({ message: 'Candidature supprimée' });
  } catch (err) {
    console.error("Erreur backend DELETE /api/admin/applications/:id:", err);
    res.status(500).json({ error: err.message });
  }
});

// --- Routes pour les Messages de Contact ---

router.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find();
    res.status(200).json(messages);
  } catch (err) {
    console.error("Erreur backend GET /api/admin/messages:", err);
    res.status(500).json({ message: err.message });
  }
});

router.delete('/messages/:id', async (req, res) => {
  try {
    const result = await Message.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Message non trouvé' });
    res.json({ message: 'Message supprimé' });
  } catch (err) {
    console.error("Erreur backend DELETE /api/admin/messages/:id:", err);
    res.status(500).json({ message: err.message });
  }
});

// --- Routes pour les Actualités ---

router.get('/news', async (req, res) => {
  try {
    const news = await News.find();
    res.status(200).json(news);
  } catch (err) {
    console.error("Erreur backend GET /api/admin/news:", err);
    res.status(500).json({ message: err.message });
  }
});

router.post('/news', async (req, res) => {
  const newsItem = new News({
    title: req.body.title,
    content: req.body.content,
    imageUrl: req.body.imageUrl,
  });
  try {
    const newNewsItem = await newsItem.save();
    res.status(201).json(newNewsItem);
  } catch (err) {
    console.error("Erreur backend POST /api/admin/news:", err);
    res.status(400).json({ message: err.message });
  }
});

router.delete('/news/:id', async (req, res) => {
  try {
    const result = await News.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Actualité non trouvée' });
    res.json({ message: 'Actualité supprimée' });
  } catch (err) {
    console.error("Erreur backend DELETE /api/admin/news/:id:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;