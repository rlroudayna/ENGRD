// src/admin/components/AddJobForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './AdminStyles.css';

export default function AddJobForm() {
  const [form, setForm] = useState({ title: '', location: '', type: '', description: '' });
  const [message, setMessage] = useState(''); // État pour le message de confirmation

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/admin/jobs', form);
      setMessage('Offre ajoutée avec succès !');
      setForm({ title: '', location: '', type: '', description: '' }); // Réinitialiser le formulaire
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'offre:", error);
      setMessage("Erreur lors de l'ajout de l'offre.");
    }
  };

  return (
    <div className="admin-main">
      <h2>Ajouter une offre</h2>
      <form onSubmit={handleSubmit} className="job-form">
        <input
          name="title"
          placeholder="Titre"
          value={form.title}
          onChange={handleChange}
          required
        />
        <input
          name="location"
          placeholder="Localisation"
          value={form.location}
          onChange={handleChange}
          required
        />
        <select name="type" value={form.type} onChange={handleChange} required>
          <option value="">Type</option>
          <option value="CDI">CDI</option>
          <option value="CDD">CDD</option>
          <option value="Freelance">Freelance</option>
          <option value="Stage">Stage</option>
        </select>
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <button type="submit">Ajouter</button>
      </form>
      {message && (
        <div className="message-box">
          <p>{message}</p>
          <button onClick={() => setMessage('')}>Fermer</button>
        </div>
      )}
    </div>
  );
}
