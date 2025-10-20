// src/admin/components/ApplicationList.jsx
import { useEffect, useState } from 'react';
import { adminClient } from '../../utils/axiosConfig';
import './AdminStyles.css';

export default function ApplicationList() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState(null);

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

  // Fonction pour demander confirmation de suppression
  const handleDeleteClick = (id) => {
    setApplicationToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    if (!applicationToDelete) return;
    
    const deleteButton = document.querySelector(`[data-app-id="${applicationToDelete}"] .delete-btn`);
    if (deleteButton) {
      deleteButton.classList.add('btn-loading');
      deleteButton.disabled = true;
    }
    
    try {
      await adminClient.delete(`/admin/applications/${applicationToDelete}`);
      setApplications(applications.filter(app => app._id !== applicationToDelete));
      
      // Créer une notification de succès
      const notification = document.createElement('div');
      notification.className = 'toast-notification';
      notification.innerHTML = `
        <span>✅ Candidature supprimée avec succès !</span>
        <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
      `;
      document.body.appendChild(notification);
      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove();
        }
      }, 4000);
    } catch (err) {
      console.error("Erreur lors de la suppression de la candidature :", err);
      
      // Créer une notification d'erreur
      const notification = document.createElement('div');
      notification.className = 'toast-notification error';
      notification.innerHTML = `
        <span>❌ Erreur lors de la suppression de la candidature</span>
        <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
      `;
      document.body.appendChild(notification);
      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove();
        }
      }, 4000);
    } finally {
      if (deleteButton) {
        deleteButton.classList.remove('btn-loading');
        deleteButton.disabled = false;
      }
      setShowDeleteConfirm(false);
      setApplicationToDelete(null);
    }
  };

  // Fonction pour annuler la suppression
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setApplicationToDelete(null);
  };

  // Fonction pour ouvrir la modale de détails
  const handleViewDetails = (application) => {
    setSelectedApplication(application);
  };

  // Fonction pour fermer la modale de détails
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
    <div className="admin-page">
      {/* Header de la section */}
      <div className="admin-header">
        <div className="admin-header-content">
          <h1 className="admin-title">
            <span className="admin-icon">📝</span>
            Gestion des Candidatures
          </h1>
          <p className="admin-subtitle">
            Consultez et gérez toutes les candidatures reçues via votre site web
          </p>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="admin-content">
        {!loading && !error && applications.length === 0 && (
          <div className="admin-empty">
            <div className="empty-icon">📋</div>
            <h3>Aucune candidature</h3>
            <p>Les candidatures apparaîtront ici lorsque des personnes postuleront via votre site</p>
          </div>
        )}

        {!loading && !error && applications.length > 0 && (
          <>
            <div className="admin-stats">
              <div className="stat-card">
                <div className="stat-number">{applications.length}</div>
                <div className="stat-label">Candidatures totales</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">
                  {applications.filter(app => app.job).length}
                </div>
                <div className="stat-label">Pour offres</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">
                  {applications.filter(app => !app.job).length}
                </div>
                <div className="stat-label">Spontanées</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">
                  {applications.filter(app => app.cv).length}
                </div>
                <div className="stat-label">Avec CV</div>
              </div>
            </div>

            <div className="admin-grid">
              {applications.map(app => (
                <div key={app._id} className="admin-card application-card" data-app-id={app._id}>
                  <div className="card-header">
                    <div className="application-type-badge" data-type={app.job ? 'offer' : 'spontaneous'}>
                      {app.job ? 'Offre' : 'Spontanée'}
                    </div>
                    <div className="card-actions">
                      <button 
                        onClick={() => handleViewDetails(app)} 
                        className="action-btn view-btn"
                        title="Voir les détails"
                      >
                        👁️
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(app._id)} 
                        className="action-btn delete-btn"
                        title="Supprimer cette candidature"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  
                  <div className="card-content">
                    <h3 className="candidate-name">{app.firstName} {app.lastName}</h3>
                    
                    <div className="candidate-meta">
                      <div className="meta-item">
                        <span className="meta-icon">📧</span>
                        <span className="meta-text">{app.email}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-icon">📞</span>
                        <span className="meta-text">{app.phone || 'Non renseigné'}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-icon">💼</span>
                        <span className="meta-text">{app.status}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-icon">📅</span>
                        <span className="meta-text">
                          {new Date(app.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>

                    {app.job && (
                      <div className="job-applied">
                        <span className="job-icon">🎯</span>
                        <span className="job-title">{app.job.title}</span>
                      </div>
                    )}

                    {app.message && (
                      <div className="message-preview">
                        <span className="message-icon">💬</span>
                        <span className="message-text">
                          {app.message.length > 80 
                            ? `${app.message.substring(0, 80)}...` 
                            : app.message
                          }
                        </span>
                      </div>
                    )}

                    <div className="documents">
                      {app.cv && (
                        <a 
                          href={`http://localhost:5000/uploads/${app.cv}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="doc-link cv-link"
                          onClick={(e) => {
                            // Vérifier si le fichier existe
                            fetch(`http://localhost:5000/uploads/${app.cv}`, { method: 'HEAD' })
                              .catch(() => {
                                e.preventDefault();
                                const notification = document.createElement('div');
                                notification.className = 'toast-notification error';
                                notification.innerHTML = `
                                  <span>❌ Fichier CV non trouvé</span>
                                  <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
                                `;
                                document.body.appendChild(notification);
                                setTimeout(() => {
                                  if (notification.parentElement) {
                                    notification.remove();
                                  }
                                }, 4000);
                              });
                          }}
                        >
                          📄 CV
                        </a>
                      )}
                      {app.coverLetter && (
                        <a 
                          href={`http://localhost:5000/uploads/${app.coverLetter}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="doc-link lm-link"
                          onClick={(e) => {
                            // Vérifier si le fichier existe
                            fetch(`http://localhost:5000/uploads/${app.coverLetter}`, { method: 'HEAD' })
                              .catch(() => {
                                e.preventDefault();
                                const notification = document.createElement('div');
                                notification.className = 'toast-notification error';
                                notification.innerHTML = `
                                  <span>❌ Fichier lettre non trouvé</span>
                                  <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
                                `;
                                document.body.appendChild(notification);
                                setTimeout(() => {
                                  if (notification.parentElement) {
                                    notification.remove();
                                  }
                                }, 4000);
                              });
                          }}
                        >
                          📝 Lettre
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="card-footer">
                    <div className="footer-info">
                      <div className="footer-date">
                        <span>📅</span>
                        <span>Reçu le {new Date(app.createdAt).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className="footer-status">
                        <span>📧</span>
                        <span className="status-active">Nouvelle candidature</span>
                      </div>
                    </div>
                    <button onClick={() => handleViewDetails(app)} className="edit-link">
                      Voir les détails
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modale de détails */}
      {selectedApplication && (
        <div className="modal-overlay">
          <div className="modal-content application-modal">
            <button className="modal-close-btn" onClick={handleCloseDetails}>×</button>
            <div className="modal-header">
              <h3>Détails de la candidature</h3>
              <div className="candidate-info">
                <h4>{selectedApplication.firstName} {selectedApplication.lastName}</h4>
                <span className="application-date">
                  Candidature du {new Date(selectedApplication.createdAt).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </div>
            
            <div className="modal-body">
              <div className="info-section">
                <h5>Informations personnelles</h5>
                <div className="info-grid">
                  <div className="info-item">
                    <strong>Email :</strong> 
                    <a href={`mailto:${selectedApplication.email}`}>{selectedApplication.email}</a>
                  </div>
                  <div className="info-item">
                    <strong>Téléphone :</strong> 
                    <a href={`tel:${selectedApplication.phone}`}>{selectedApplication.phone}</a>
                  </div>
                  <div className="info-item">
                    <strong>Situation :</strong> {selectedApplication.status}
                    {selectedApplication.otherStatus && ` (${selectedApplication.otherStatus})`}
                  </div>
                  <div className="info-item">
                    <strong>Type :</strong> 
                    {selectedApplication.job 
                      ? `Candidature pour "${selectedApplication.job.title}"` 
                      : 'Candidature spontanée'
                    }
                  </div>
                </div>
              </div>

              {selectedApplication.message && (
                <div className="info-section">
                  <h5>Message du candidat</h5>
                  <div className="message-full">
                    {selectedApplication.message}
                  </div>
                </div>
              )}

              <div className="info-section">
                <h5>Documents</h5>
                <div className="documents-list">
                  {selectedApplication.cv ? (
                    <a 
                      href={`http://localhost:5000/uploads/${selectedApplication.cv}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="document-link"
                      onClick={(e) => {
                        console.log('📄 Téléchargement du CV:', selectedApplication.cv);
                        // Vérifier si le fichier existe
                        fetch(`http://localhost:5000/uploads/${selectedApplication.cv}`, { method: 'HEAD' })
                          .catch(() => {
                            e.preventDefault();
                            const notification = document.createElement('div');
                            notification.className = 'toast-notification error';
                            notification.innerHTML = `
                              <span>❌ Fichier CV non trouvé sur le serveur</span>
                              <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
                            `;
                            document.body.appendChild(notification);
                            setTimeout(() => {
                              if (notification.parentElement) {
                                notification.remove();
                              }
                            }, 4000);
                          });
                      }}
                    >
                      📄 Télécharger le CV
                    </a>
                  ) : (
                    <span className="no-document">Aucun CV fourni</span>
                  )}
                  
                  {selectedApplication.coverLetter ? (
                    <a 
                      href={`http://localhost:5000/uploads/${selectedApplication.coverLetter}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="document-link"
                      onClick={(e) => {
                        console.log('📝 Téléchargement de la lettre:', selectedApplication.coverLetter);
                        // Vérifier si le fichier existe
                        fetch(`http://localhost:5000/uploads/${selectedApplication.coverLetter}`, { method: 'HEAD' })
                          .catch(() => {
                            e.preventDefault();
                            const notification = document.createElement('div');
                            notification.className = 'toast-notification error';
                            notification.innerHTML = `
                              <span>❌ Fichier lettre non trouvé sur le serveur</span>
                              <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
                            `;
                            document.body.appendChild(notification);
                            setTimeout(() => {
                              if (notification.parentElement) {
                                notification.remove();
                              }
                            }, 4000);
                          });
                      }}
                    >
                      📝 Télécharger la lettre de motivation
                    </a>
                  ) : (
                    <span className="no-document">Aucune lettre de motivation</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3>Confirmer la suppression</h3>
            </div>
            
            <div className="modal-body">
              <p>Êtes-vous sûr de vouloir supprimer cette candidature ? Cette action est irréversible.</p>
            </div>

            <div className="modal-footer">
              <div className="modal-footer-buttons">
                <button 
                  className="delete-modal-button"
                  onClick={handleDelete}
                >
                  🗑️ Supprimer
                </button>
                <button className="cancel-modal-button" onClick={handleCancelDelete}>
                  ❌ Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}