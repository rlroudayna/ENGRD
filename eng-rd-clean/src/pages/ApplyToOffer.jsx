// src/pages/ApplyToOffer.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Pour récupérer l'ID de l'offre depuis l'URL
import axios from 'axios';
import ApplicationForm from '../components/ApplicationForm'; // Importe le composant de formulaire centralisé
import '../App.css'; // Pour les styles généraux (.apply, .apply-title)

const ApplyToOffer = () => {
  const { id: jobId } = useParams(); // Récupère l'ID de l'offre depuis l'URL (renommé en jobId)
  const [jobTitle, setJobTitle] = useState('...'); // État pour le titre de l'offre
  const [loadingJob, setLoadingJob] = useState(true); // État de chargement du titre de l'offre
  const [jobError, setJobError] = useState(null); // État d'erreur pour le titre de l'offre

  useEffect(() => {
    // ⭐ NOUVEAU : Message de débogage pour voir l'ID de l'offre
    console.log("ApplyToOffer: Tentative de chargement de l'offre avec l'ID:", jobId);

    const fetchJobDetails = async () => {
      try {
        // Vérifie si jobId est défini avant de faire l'appel API
        if (!jobId) {
          setJobError("ID de l'offre non fourni dans l'URL.");
          setLoadingJob(false);
          return; // Arrête la fonction si l'ID est manquant
        }
        
        const response = await axios.get(`http://localhost:5000/api/jobs/${jobId}`);
        setJobTitle(response.data.title);
      } catch (err) {
        console.error("ApplyToOffer: Erreur lors de la récupération de l'offre :", err);
        // Message d'erreur plus spécifique en fonction de la réponse du serveur
        if (err.response) {
          // Le serveur a répondu avec un code d'état
          setJobError(`Erreur du serveur (${err.response.status}): ${err.response.data.message || 'Détails non disponibles.'}`);
        } else if (err.request) {
          // La requête a été faite mais aucune réponse n'a été reçue (serveur non démarré, problème réseau)
          setJobError("Impossible de se connecter au serveur backend. Vérifiez que le serveur est lancé (port 5000).");
        } else {
          // Autre chose s'est mal passée
          setJobError("Erreur inattendue lors de la récupération des détails de l'offre.");
        }
      } finally {
        setLoadingJob(false);
      }
    };
    
    fetchJobDetails();
  }, [jobId]); // S'exécute quand l'ID de l'offre change

  if (loadingJob) {
    return (
      <div className="apply">
        <h2 className="apply-title">Chargement de l'offre...</h2>
        <p style={{textAlign: 'center'}}>Veuillez patienter.</p>
      </div>
    );
  }

  if (jobError) {
    return (
      <div className="apply">
        <h2 className="apply-title" style={{color: 'red'}}>Erreur</h2>
        <p style={{textAlign: 'center'}}>{jobError}</p>
      </div>
    );
  }

  return (
    <div className="apply"> {/* Utilise la classe .apply pour le style */}
      <h2 className="apply-title">Candidature pour l'offre : <br/>"{jobTitle}"</h2>
      <ApplicationForm jobId={jobId} /> {/* Passe le jobId au composant de formulaire */}
    </div>
  );
};

export default ApplyToOffer;