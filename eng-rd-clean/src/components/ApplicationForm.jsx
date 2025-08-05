// src/components/ApplicationForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import '../App.css'; // Pour les styles généraux du formulaire (.apply, .apply-title, etc.)

// Ce composant est réutilisable pour les candidatures spontanées et les candidatures pour une offre
const ApplicationForm = ({ jobId }) => { // Reçoit jobId en prop
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    status: '',      
    otherStatus: '', 
    email: '',
    phone: '',
    message: '',
    cv: null,
    coverLetter: null,
    // ⭐ Vérification : jobId est ajouté ici SEULEMENT si la prop est fournie
    ...(jobId && { jobId: jobId }) 
  });
  const [submitStatus, setSubmitStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ⭐ Log de débogage pour voir la prop jobId reçue
  console.log("ApplicationForm - Prop jobId reçue:", jobId);
  // ⭐ Log de débogage pour voir l'état initial de formData
  console.log("ApplicationForm - formData initial:", formData);


  // Gère les inputs standards et le select
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Gère les fichiers
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('Envoi de votre candidature en cours...');

    const form = new FormData();
    for (const key in formData) {
      // Ne pas ajouter 'otherStatus' si le statut n'est pas 'Autre'
      if (key === 'otherStatus' && formData.status !== 'Autre') {
        continue;
      }
      // N'ajoute pas les champs null ou undefined (pour les fichiers non sélectionnés)
      if (formData[key] !== null && formData[key] !== undefined) {
        form.append(key, formData[key]);
      }
    }
    
    // ⭐ Log de débogage pour voir les données envoyées dans FormData (hors fichiers)
    // Note: FormData ne peut pas être loggé directement comme un objet simple
    // On peut itérer pour voir les entrées
    console.log("ApplicationForm - Données FormData avant envoi:");
    for (let pair of form.entries()) {
      console.log(pair[0]+ ': ' + pair[1]); 
    }


    try {
      await axios.post('http://localhost:5000/api/applications', form, {
        headers: { 
          'Content-Type': 'multipart/form-data' 
        }
      });
      setSubmitStatus('Candidature envoyée avec succès ! Nous vous contacterons bientôt.');
      // Réinitialiser le formulaire après succès
      setFormData({
        firstName: '',
        lastName: '',
        status: '',
        otherStatus: '',
        email: '',
        phone: '',
        message: '',
        cv: null,
        coverLetter: null,
        ...(jobId && { jobId: jobId }) // Garde le jobId si c'est une candidature pour une offre
      });
      // Réinitialiser les inputs de type file manuellement
      e.target.reset(); 
    } catch (error) {
      console.error('Erreur lors de l’envoi de la candidature :', error.response ? error.response.data : error.message);
      setSubmitStatus(`Erreur lors de l’envoi. ${error.response && error.response.data.message ? error.response.data.message : 'Veuillez réessayer.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="apply-form" onSubmit={handleSubmit} encType="multipart/form-data">

      <div className="form-group">
        <label htmlFor="firstName">Prénom *</label>
        <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label htmlFor="lastName">Nom de famille *</label>
        <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label htmlFor="status">Situation professionnelle *</label>
        <select id="status" name="status" value={formData.status} onChange={handleChange} required>
          <option value="">-- Sélectionnez --</option>
          <option value="Étudiant">Étudiant</option>
          <option value="En recherche d'emploi">En recherche d'emploi</option>
          <option value="En poste">En poste</option>
          <option value="Autre">Autre</option>
        </select>
      </div>

      {formData.status === 'Autre' && (
        <div className="form-group">
          <label htmlFor="otherStatus">Merci de préciser votre situation</label>
          <input
            type="text"
            id="otherStatus"
            name="otherStatus"
            value={formData.otherStatus}
            onChange={handleChange}
            required
          />
        </div>
      )}

      <div className="form-group">
        <label htmlFor="email">Email *</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label htmlFor="phone">Téléphone *</label>
        <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label htmlFor="message">Décrivez votre recherche</label>
        <textarea
          id="message"
          name="message"
          rows="4"
          value={formData.message}
          onChange={handleChange}
          className="vertical-only"
        ></textarea>
      </div>

      <div className="form-group">
        <label htmlFor="cv">CV *</label>
        <input type="file" id="cv" name="cv" accept=".pdf,.doc,.docx" onChange={handleFileChange} required />
      </div>

      <div className="form-group">
        <label htmlFor="coverLetter">Lettre de motivation</label>
        <input type="file" id="coverLetter" name="coverLetter" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
      </div>

      <button type="submit" className="submit-btn" disabled={isSubmitting}>
        {isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
      </button>
      {submitStatus && <p className={`submit-message ${submitStatus.includes('succès') ? 'success' : 'error'}`}>{submitStatus}</p>}
    </form>
  );
};

export default ApplicationForm;