// src/admin/components/JobListAdmin.jsx
import React, { useEffect, useState } from 'react';
import { adminClient } from '../../utils/axiosConfig';
import { Link } from 'react-router-dom';
import './AdminStyles.css'; // Assurez-vous que ce fichier existe

export default function JobListAdmin() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true); // Pour montrer si les données chargent
  const [error, setError] = useState(null);   // Pour montrer les erreurs

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await adminClient.get('/admin/jobs');
        setJobs(response.data);
      } catch (err) {
        console.error("Erreur lors de la récupération des offres :", err);
        setError("Impossible de charger les offres. Veuillez réessayer.");
      } finally {
        setLoading(false); // Les données ont fini de charger (avec ou sans erreur)
      }
    };

    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette offre ?")) {
      try {
        await adminClient.delete(`/admin/jobs/${id}`);
        setJobs(jobs.filter(job => job._id !== id)); // Met à jour la liste après suppression
        alert("Offre supprimée avec succès !"); 
      } catch (err) {
        console.error("Erreur lors de la suppression de l'offre :", err);
        alert("Erreur lors de la suppression de l'offre.");
      }
    }
  };

  if (loading) {
    return (
      <div className="admin-main">
        <div className="loading-spinner"></div>
        <p>Chargement des offres...</p>
      </div>
    );
  }

  if (error) {
    return <div className="admin-main error-message">{error}</div>;
  }

  return (
    <div className="admin-main">
      <h2>Gestion des Offres</h2>
      <Link to="/admin/jobs/add" className="add-button">+ Ajouter une offre</Link>
      {jobs.length === 0 ? (
        <p className="no-content-message">Aucune offre d'emploi disponible pour le moment.</p>
      ) : (
        <ul className="job-list-admin">
          {jobs.map(job => (
            <li key={job._id}>
              {/* ⭐ NOUVEAU : Conteneur pour le texte de l'offre */}
              <div className="list-text-content"> 
                <strong>{job.title}</strong>
                <p>{job.location}</p>
                {/* Ajoutez d'autres détails de l'offre si vous voulez */}
              </div>
              {/* ⭐ NOUVEAU : Conteneur pour les boutons d'action */}
              <div className="list-action-buttons"> 
                <Link to={`/admin/jobs/edit/${job._id}`} className="edit">Modifier</Link>
                <button onClick={() => handleDelete(job._id)} className="delete">Supprimer</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}