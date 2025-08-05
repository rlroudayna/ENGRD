// src/pages/Contact.jsx
import React, { useState } from 'react';
import axios from 'axios';
import '../App.css'; // Pour les styles généraux

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ⭐ Vérification de la fonction handleChange :
  // Elle est correcte et met à jour l'état pour le champ correspondant.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('Envoi de votre message en cours...');

    try {
      const response = await axios.post('http://localhost:5000/api/messages', formData);
      setSubmitStatus('Message envoyé avec succès ! Nous vous répondrons bientôt.');
      // Réinitialiser le formulaire
      setFormData({ name: '', email: '', subject: '', message: '' });
      console.log('Réponse du serveur:', response.data);
    } catch (error) {
      console.error('Erreur lors de l’envoi du message :', error.response ? error.response.data : error.message);
      setSubmitStatus(`Erreur lors de l’envoi. ${error.response && error.response.data.message ? error.response.data.message : 'Veuillez réessayer.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-content"> {/* Utilisez page-content pour le cadre général */}
      <h1 className="page-title">Contactez-nous</h1>
      <p style={{textAlign: 'center', marginBottom: '30px', color: '#666'}}>
        Une question ? Une demande ? Nous sommes là pour vous aider.
      </p>
      <form onSubmit={handleSubmit} className="apply-form" style={{maxWidth: '600px', margin: '0 auto'}}> {/* Réutilise les styles de formulaire .apply-form */}
        <div className="form-group">
          <label htmlFor="name">Votre nom *</label>
          {/* ⭐ Vérification : 'value' est lié à formData.name et 'onChange' est présent */}
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Votre email *</label>
          {/* ⭐ Vérification : 'value' est lié à formData.email et 'onChange' est présent */}
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="subject">Objet (optionnel)</label>
          {/* ⭐ Vérification : 'value' est lié à formData.subject et 'onChange' est présent */}
          <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="message">Votre message *</label>
          {/* ⭐ Vérification : 'value' est lié à formData.message et 'onChange' est présent */}
          <textarea id="message" name="message" value={formData.message} onChange={handleChange} rows="6" className="vertical-only" required></textarea>
        </div>
        <button type="submit" className="submit-btn" disabled={isSubmitting}>
          {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
        </button>
      </form>
      {submitStatus && <p className={`submit-message ${submitStatus.includes('succès') ? 'success' : 'error'}`} style={{maxWidth: '600px', margin: '20px auto'}}>{submitStatus}</p>}
    </div>
  );
};

export default Contact;