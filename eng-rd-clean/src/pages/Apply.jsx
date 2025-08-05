// src/pages/Apply.jsx
import React from 'react';
import ApplicationForm from '../components/ApplicationForm'; // Importe le composant de formulaire centralisé
import '../App.css'; // Pour les styles généraux (.apply)

const Apply = () => {
  return (
    <div className="apply"> {/* Utilise la classe .apply pour le style */}
      <h2 className="apply-title">Formulaire de Candidature Spontanée</h2>
      <ApplicationForm /> {/* Rend le formulaire sans jobId */}
    </div>
  );
};

export default Apply;