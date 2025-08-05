// src/admin/components/EditJobForm.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './AdminStyles.css';

export default function EditJobForm() {
  const { id } = useParams();
  const [form, setForm] = useState({ title: '', location: '', type: '', description: '' });
  const [message, setMessage] = useState(''); // État pour le message de confirmation

  useEffect(() => {
    axios.get(`http://localhost:5000/api/jobs/${id}`)
      .then(res => setForm(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/admin/jobs/${id}`, form);
      setMessage('Offre mise à jour avec succès !');
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'offre:", error);
      setMessage("Erreur lors de la mise à jour de l'offre.");
    }
  };

  return (
    <div className="admin-main">
      <h2>Modifier l'offre</h2>
      <form onSubmit={handleSubmit} className="job-form">
        <input name="title" value={form.title} onChange={handleChange} required />
        <input name="location" value={form.location} onChange={handleChange} required />
        <select name="type" value={form.type} onChange={handleChange} required>
          <option value="CDI">CDI</option>
          <option value="CDD">CDD</option>
          <option value="Freelance">Freelance</option>
          <option value="Stage">Stage</option>
        </select>
        <textarea name="description" value={form.description} onChange={handleChange} required />
        <button type="submit">Mettre à jour</button>
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
