// src/admin/components/ApplicationList.jsx
import React, { useEffect, useState } from 'react';
import { adminClient } from '../../utils/axiosConfig';
import './AdminStyles.css'; // Assurez-vous que ce fichier existe

export default function ApplicationList() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null); // ⭐ NOUVEAU : Pour la candidature sélectionnée pour les détails

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await adminClient.get('/admin/applications');
        console.log('Frontend received applications:', response.data.map(app => ({
          name: app.firstName + ' ' + app.lastName,
          jobId: app.jobId,
          job: app.job,
          jobTitle: app.job ? app.job.title : 'null'
        })));
        setApplications(response.data);
      } catch (err) {
        console.error("Erreur lors de la récupération des candidatures (frontend) :", err);
        if (err.response) {
          setError(`Erreur du serveur (${err.response.status}): ${err.response.data.message || err.response.data.error || 'Détails non disponibles.'}`);
        } else if (err.request) {
          setError("Impossible de se connecter au serveur backend. Vérifiez que le serveur est lancé et accessible sur le port 5000.");
        } else {
          setError("Erreur inattendue lors de la récupération des candidatures.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette candidature ?")) {
      try {
        await adminClient.delete(`/admin/applications/${id}`);
        setApplications(applications.filter(app => app._id !== id));
        alert("Candidature supprimée avec succès !");
      } catch (err) {
        console.error("Erreur lors de la suppression de la candidature :", err);
        alert("Erreur lors de la suppression de la candidature.");
      }
    }
  };

  // ⭐ NOUVEAU : Fonction pour ouvrir la modale de détails
  const handleViewDetails = (application) => {
    setSelectedApplication(application);
  };

  // ⭐ NOUVEAU : Fonction pour fermer la modale de détails
  const handleCloseDetails = () => {
    setSelectedApplication(null);
  };

  if (loading) {
    return (
      <div className="admin-main">
        <div className="loading-spinner"></div>
        <p>Chargement des candidatures...</p>
      </div>
    );
  }

  if (error) {
    return <div className="admin-main error-message">{error}</div>;
  }

  return (
    <div className="admin-main">
      <h2>Gestion des Candidatures</h2>
      {applications.length === 0 ? (
        <p className="no-content-message">Aucune candidature disponible pour le moment.</p>
      ) : (
        <ul className="admin-list">
          {applications.map(app => (
            <li key={app._id}>
              <div>
                <strong>{app.firstName} {app.lastName}</strong> – {app.email}
                {/* ⭐ MODIFICATION : Affichage du type de candidature */}
                <p>
                  Type : {app.job ? `Pour l'offre "${app.job.title}"` : 'Candidature spontanée'}
                </p>
                <p>Situation : {app.status} {app.otherStatus ? `(${app.otherStatus})` : ''}</p>
                <p>Téléphone : {app.phone || 'N/A'}</p>
                {/* ⭐ NOUVEAU : Affichage de l'extrait du message */}
                <p>Message : {app.message ? app.message.substring(0, 50) + '...' : 'Aucun message'}</p>
                <p className="application-date">Soumis le : {new Date(app.createdAt).toLocaleDateString('fr-FR')}</p>
              </div>
              <div>
                {/* ⭐ NOUVEAU : Bouton pour voir les détails */}
                <button onClick={() => handleViewDetails(app)} className="view-details-btn">Voir détails</button>
                {app.cv && (
                  <a href={`http://localhost:5000/uploads/${app.cv}`} target="_blank" rel="noopener noreferrer" className="view-link">Voir CV</a>
                )}
                {app.coverLetter && (
                  <a href={`http://localhost:5000/uploads/${app.coverLetter}`} target="_blank" rel="noopener noreferrer" className="view-link">Voir LM</a>
                )}
                <button onClick={() => handleDelete(app._id)} className="delete">Supprimer</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* ⭐ NOUVEAU : Modale de détails de la candidature */}
      {selectedApplication && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close-btn" onClick={handleCloseDetails}>&times;</button>
            <h3>Détails de la Candidature</h3>
            <p><strong>Nom complet :</strong> {selectedApplication.firstName} {selectedApplication.lastName}</p>
            <p><strong>Email :</strong> {selectedApplication.email}</p>
            <p><strong>Téléphone :</strong> {selectedApplication.phone}</p>
            <p><strong>Type :</strong> {selectedApplication.job ? `Pour l'offre "${selectedApplication.job.title}"` : 'Candidature spontanée'}</p>
            <p><strong>Situation :</strong> {selectedApplication.status} {selectedApplication.otherStatus ? `(${selectedApplication.otherStatus})` : ''}</p>
            <p><strong>Message :</strong> {selectedApplication.message || 'Aucun message fourni.'}</p>
            <p><strong>Soumis le :</strong> {new Date(selectedApplication.createdAt).toLocaleDateString('fr-FR')}</p>
            {selectedApplication.cv && (
              <p><strong>CV :</strong> <a href={`http://localhost:5000/uploads/${selectedApplication.cv}`} target="_blank" rel="noopener noreferrer" className="view-link">Télécharger CV</a></p>
            )}
            {selectedApplication.coverLetter && (
              <p><strong>Lettre de motivation :</strong> <a href={`http://localhost:5000/uploads/${selectedApplication.coverLetter}`} target="_blank" rel="noopener noreferrer" className="view-link">Télécharger LM</a></p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}