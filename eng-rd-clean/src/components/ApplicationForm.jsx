// src/components/ApplicationForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './ApplicationForm.css';

// Ce composant est réutilisable pour les candidatures spontanées et les candidatures pour une offre
const ApplicationForm = ({ jobId, jobTitle }) => { // Reçoit jobId et jobTitle en props
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
    <div className="application-container">
      {/* Header de la candidature */}
      <div className="application-header">
        <h1 className="application-title">Postuler à cette offre</h1>
        {jobTitle && (
          <div className="job-info-badge">
            {jobTitle}
          </div>
        )}
        <p className="application-subtitle">
          Remplissez le formulaire ci-dessous pour nous envoyer votre candidature
        </p>
      </div>

      {/* Indicateur de progression */}
      <div className="progress-indicator">
        <div className="progress-step current">
          <div className="step-circle current">1</div>
          <span className="step-label current">Informations</span>
        </div>
        <div className="progress-step">
          <div className="step-circle">2</div>
          <span className="step-label">Documents</span>
        </div>
        <div className="progress-step">
          <div className="step-circle">3</div>
          <span className="step-label">Envoi</span>
        </div>
      </div>

      <form className="application-form" onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Informations personnelles */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">
              Prénom <span className="required-asterisk">*</span>
            </label>
            <input 
              type="text" 
              id="firstName" 
              name="firstName" 
              value={formData.firstName} 
              onChange={handleChange} 
              className="form-input"
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">
              Nom de famille <span className="required-asterisk">*</span>
            </label>
            <input 
              type="text" 
              id="lastName" 
              name="lastName" 
              value={formData.lastName} 
              onChange={handleChange} 
              className="form-input"
              required 
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email">
              Email <span className="required-asterisk">*</span>
            </label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              className="form-input"
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">
              Téléphone <span className="required-asterisk">*</span>
            </label>
            <input 
              type="tel" 
              id="phone" 
              name="phone" 
              value={formData.phone} 
              onChange={handleChange} 
              className="form-input"
              required 
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="status">
            Situation professionnelle <span className="required-asterisk">*</span>
          </label>
          <select 
            id="status" 
            name="status" 
            value={formData.status} 
            onChange={handleChange} 
            className="form-select"
            required
          >
            <option value="">-- Sélectionnez votre situation --</option>
            <option value="Étudiant">Étudiant</option>
            <option value="En recherche d'emploi">En recherche d'emploi</option>
            <option value="En poste">En poste</option>
            <option value="Autre">Autre</option>
          </select>
        </div>

        {formData.status === 'Autre' && (
          <div className="form-group conditional-field">
            <label htmlFor="otherStatus">
              Merci de préciser votre situation <span className="required-asterisk">*</span>
            </label>
            <input
              type="text"
              id="otherStatus"
              name="otherStatus"
              value={formData.otherStatus}
              onChange={handleChange}
              className="form-input"
              placeholder="Décrivez votre situation actuelle"
              required
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="message">Lettre de motivation / Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="form-textarea"
            placeholder="Parlez-nous de votre motivation, de vos compétences et de ce qui vous intéresse dans ce poste..."
            rows="5"
          ></textarea>
        </div>

        {/* Upload de fichiers */}
        <div className="form-group">
          <label htmlFor="cv">
            CV <span className="required-asterisk">*</span>
          </label>
          <div className="file-upload-container">
            {!formData.cv ? (
              <div 
                className="file-upload-area" 
                onClick={() => {
                  console.log('Zone CV cliquée - Ouverture de l\'explorateur...');
                  const fileInput = document.getElementById('cv');
                  if (fileInput) {
                    fileInput.click();
                  } else {
                    console.error('Élément input CV non trouvé');
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                <input 
                  type="file" 
                  id="cv" 
                  name="cv" 
                  accept=".pdf,.doc,.docx" 
                  onChange={handleFileChange} 
                  className="file-upload-input"
                  style={{ display: 'none' }}
                  required 
                />
                <div className="file-upload-icon">📄</div>
                <div className="file-upload-text">Cliquez pour sélectionner votre CV</div>
                <div className="file-upload-hint">Formats acceptés: PDF, DOC, DOCX (max 5MB)</div>
              </div>
            ) : (
              <div className="file-upload-area file-selected">
                <div className="file-selected-info">
                  <span className="file-name">{formData.cv.name}</span>
                  <span className="file-size">{(formData.cv.size / 1024 / 1024).toFixed(2)} MB</span>
                  <button 
                    type="button" 
                    className="remove-file-btn"
                    onClick={() => setFormData(prev => ({ ...prev, cv: null }))}
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="coverLetter">Lettre de motivation (fichier)</label>
          <div className="file-upload-container">
            {!formData.coverLetter ? (
              <div 
                className="file-upload-area"
                onClick={() => {
                  console.log('Zone Lettre de motivation cliquée - Ouverture de l\'explorateur...');
                  const fileInput = document.getElementById('coverLetter');
                  if (fileInput) {
                    fileInput.click();
                  } else {
                    console.error('Élément input Lettre de motivation non trouvé');
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                <input 
                  type="file" 
                  id="coverLetter" 
                  name="coverLetter" 
                  accept=".pdf,.doc,.docx" 
                  onChange={handleFileChange} 
                  className="file-upload-input"
                  style={{ display: 'none' }}
                />
                <div className="file-upload-icon">📝</div>
                <div className="file-upload-text">Lettre de motivation (optionnel)</div>
                <div className="file-upload-hint">Formats acceptés: PDF, DOC, DOCX (max 5MB)</div>
              </div>
            ) : (
              <div className="file-upload-area file-selected">
                <div className="file-selected-info">
                  <span className="file-name">{formData.coverLetter.name}</span>
                  <span className="file-size">{(formData.coverLetter.size / 1024 / 1024).toFixed(2)} MB</span>
                  <button 
                    type="button" 
                    className="remove-file-btn"
                    onClick={() => setFormData(prev => ({ ...prev, coverLetter: null }))}
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <div className="loading-spinner"></div>
              Envoi en cours...
            </>
          ) : (
            <>
              📤 Envoyer ma candidature
            </>
          )}
        </button>

        {submitStatus && (
          <div className={`status-message ${submitStatus.includes('succès') ? 'success' : 'error'}`}>
            {submitStatus.includes('succès') ? '✅' : '❌'} {submitStatus}
          </div>
        )}
      </form>
    </div>
  );
};

export default ApplicationForm;