// backend/routes/application.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Application = require('../models/application');

// Configuration de Multer pour l'upload de fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|doc|docx/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Seuls les fichiers PDF, DOC et DOCX sont autorisés !'));
  }
}).fields([
  { name: 'cv', maxCount: 1 },
  { name: 'coverLetter', maxCount: 1 }
]);

// Route POST pour soumettre une candidature
router.post('/', upload, async (req, res) => {
  try {
    // ⭐ Log de débogage pour voir toutes les données reçues dans req.body
    console.log("Backend - Données reçues dans req.body:", req.body);
    // ⭐ Log de débogage pour voir les fichiers reçus
    console.log("Backend - Fichiers reçus dans req.files:", req.files);

    if (!req.files || !req.files.cv) {
      return res.status(400).json({ message: 'Le fichier CV est obligatoire.' });
    }

    const cvPath = req.files.cv[0].filename;
    const coverLetterPath = req.files.coverLetter ? req.files.coverLetter[0].filename : null;

    // Récupère le jobId de req.body. Il devrait être là si le formulaire l'a envoyé.
    const jobIdFromRequest = req.body.jobId || null; 
    // ⭐ Log de débogage pour voir la valeur de jobId avant de créer l'objet Application
    console.log("Backend - jobId extrait de la requête:", jobIdFromRequest);


    const newApplication = new Application({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      message: req.body.message,
      status: req.body.status,
      otherStatus: req.body.otherStatus,
      cv: cvPath,
      coverLetter: coverLetterPath,
      jobId: jobIdFromRequest, // Assurez-vous que c'est bien jobIdFromRequest qui est utilisé
    });

    const savedApplication = await newApplication.save();
    // ⭐ Log de débogage pour voir la candidature sauvegardée, y compris le jobId
    console.log("Backend - Candidature sauvegardée:", savedApplication);
    
    res.status(201).json(savedApplication);
  } catch (error) {
    console.error('Erreur lors de la soumission de la candidature (backend) :', error);
    res.status(500).json({ message: 'Erreur serveur lors de la soumission de la candidature.', error: error.message });
  }
});

module.exports = router;