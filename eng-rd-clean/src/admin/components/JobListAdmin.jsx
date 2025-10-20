// src/admin/components/JobListAdmin.jsx
import { useEffect, useState } from 'react';
import { adminClient } from '../../utils/axiosConfig';
import { Link } from 'react-router-dom';
import './AdminStyles.css';

export default function JobListAdmin() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [filters, setFilters] = useState({
    sector: '',
    type: '',
    search: ''
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await adminClient.get('/admin/jobs');
        setJobs(response.data);
        setFilteredJobs(response.data);
      } catch (err) {
        console.error("Erreur lors de la récupération des offres :", err);
        setError("Impossible de charger les offres. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Effet pour filtrer les offres
  useEffect(() => {
    let filtered = jobs;

    if (filters.sector) {
      filtered = filtered.filter(job => job.sector === filters.sector);
    }

    if (filters.type) {
      filtered = filtered.filter(job => job.type === filters.type);
    }

    if (filters.search) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        job.location.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredJobs(filtered);
  }, [jobs, filters]);

  // Fonction pour gérer les changements de filtres
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Fonction pour demander confirmation de suppression
  const handleDeleteClick = (id) => {
    setJobToDelete(id);
    setShowDeleteConfirm(true);
  };

  // Fonction pour supprimer une offre
  const handleDelete = async () => {
    if (!jobToDelete) return;
    
    const deleteButton = document.querySelector(`[data-job-id="${jobToDelete}"] .delete-btn`);
    if (deleteButton) {
      deleteButton.classList.add('btn-loading');
      deleteButton.disabled = true;
    }
    
    try {
      await adminClient.delete(`/admin/jobs/${jobToDelete}`);
      setJobs(jobs.filter(job => job._id !== jobToDelete));
      
      // Créer une notification de succès
      const notification = document.createElement('div');
      notification.className = 'toast-notification';
      notification.innerHTML = `
        <span>✅ Offre supprimée avec succès !</span>
        <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
      `;
      document.body.appendChild(notification);
      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove();
        }
      }, 4000);
    } catch (err) {
      console.error("Erreur lors de la suppression de l'offre :", err);
      
      // Créer une notification d'erreur
      const notification = document.createElement('div');
      notification.className = 'toast-notification error';
      notification.innerHTML = `
        <span>❌ Erreur lors de la suppression de l'offre</span>
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
      setJobToDelete(null);
    }
  };

  // Fonction pour annuler la suppression
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setJobToDelete(null);
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
    <div className="admin-page">
      {/* Header de la section */}
      <div className="admin-header">
        <div className="admin-header-content">
          <h1 className="admin-title">
            <span className="admin-icon">💼</span>
            Gestion des Offres d'emploi
          </h1>
          <p className="admin-subtitle">
            Créez, modifiez et gérez toutes les offres d'emploi de votre entreprise
          </p>
        </div>
        <Link 
          to="/admin/jobs/add" 
          className="admin-add-button"
        >
          <span className="btn-icon">➕</span>
          Nouvelle offre
        </Link>
      </div>

      {/* Contenu principal */}
      <div className="admin-content">
        {!loading && !error && jobs.length === 0 && (
          <div className="admin-empty">
            <div className="empty-icon">📋</div>
            <h3>Aucune offre d'emploi</h3>
            <p>Commencez par créer votre première offre d'emploi</p>
            <Link to="/admin/jobs/add" className="admin-add-button">
              Créer une offre
            </Link>
          </div>
        )}

        {!loading && !error && jobs.length > 0 && (
          <>
            <div className="admin-stats">
              <div className="stat-card">
                <div className="stat-number">{jobs.length}</div>
                <div className="stat-label">Offres totales</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{jobs.filter(job => job.type === 'CDI').length}</div>
                <div className="stat-label">CDI</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{jobs.filter(job => job.type === 'CDD').length}</div>
                <div className="stat-label">CDD</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{jobs.filter(job => job.type === 'Freelance').length}</div>
                <div className="stat-label">Freelance</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{jobs.filter(job => job.type === 'Stage').length}</div>
                <div className="stat-label">Stages</div>
              </div>
            </div>

            {/* Filtres */}
            <div className="admin-filters">
              <div className="filters-row">
                <div className="filter-group">
                  <label>Rechercher</label>
                  <input
                    type="text"
                    name="search"
                    placeholder="Titre ou localisation..."
                    value={filters.search}
                    onChange={handleFilterChange}
                    className="filter-input"
                  />
                </div>
                
                <div className="filter-group">
                  <label>Secteur</label>
                  <select name="sector" value={filters.sector} onChange={handleFilterChange} className="filter-select">
                    <option value="">🌐 Tous les secteurs</option>
                    <option value="Automobile">🚗 Automobile</option>
                    <option value="Aéronautique">✈️ Aéronautique</option>
                    <option value="Ferroviaire">🚄 Ferroviaire</option>
                    <option value="Spatial">🚀 Spatial</option>
                    <option value="Militaire">🛡️ Militaire</option>
                    <option value="Énergie">⚡ Énergie</option>
                    <option value="Santé">🏥 Santé</option>
                    <option value="IT">💻 IT</option>
                    <option value="RH">👥 Ressources Humaines</option>
                    <option value="Marketing">📈 Marketing</option>
                    <option value="Finance">💰 Finance</option>
                    <option value="Commercial">🤝 Commercial</option>
                    <option value="Communication">📢 Communication</option>
                    <option value="Juridique">⚖️ Juridique</option>
                    <option value="Qualité">✅ Qualité</option>
                    <option value="Logistique">📦 Logistique</option>
                    <option value="Production">🏭 Production</option>
                    <option value="R&D">🔬 Recherche & Développement</option>
                    <option value="Consulting">💼 Conseil</option>
                    <option value="Formation">🎓 Formation</option>
                  </select>
                </div>
                
                <div className="filter-group">
                  <label>Type de contrat</label>
                  <select name="type" value={filters.type} onChange={handleFilterChange} className="filter-select">
                    <option value="">📋 Tous les types</option>
                    <option value="CDI">📝 CDI</option>
                    <option value="CDD">📄 CDD</option>
                    <option value="Freelance">💼 Freelance</option>
                    <option value="Stage">🎓 Stage</option>
                  </select>
                </div>
              </div>
              
              <div className="filter-results">
                <span className="results-count">
                  {filteredJobs.length} offre{filteredJobs.length > 1 ? 's' : ''} trouvée{filteredJobs.length > 1 ? 's' : ''}
                </span>
              </div>
            </div>

            <div className="admin-grid">
              {filteredJobs.map(job => (
                <div key={job._id} className="admin-card" data-job-id={job._id}>
                  <div className="card-header">
                    <div className="job-type-badge" data-type={job.type}>
                      {job.type}
                    </div>
                    <div className="card-actions">
                      <Link to={`/admin/jobs/edit/${job._id}`} className="action-btn edit-btn" title="Modifier cette offre">
                        ✏️
                      </Link>
                      <button 
                        onClick={() => handleDeleteClick(job._id)} 
                        className="action-btn delete-btn"
                        title="Supprimer cette offre"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  
                  <div className="card-content">
                    <h3 className="job-title">{job.title}</h3>
                    
                    <div className="job-meta">
                      <div className="meta-item">
                        <span className="meta-icon">🏢</span>
                        <span className="meta-text">{job.sector || 'Non spécifié'}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-icon">📍</span>
                        <span className="meta-text">{job.location}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-icon">📅</span>
                        <span className="meta-text">
                          {new Date(job.createdAt || job.postedAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>

                    {job.salary && (
                      <div className="job-salary">
                        <span className="salary-icon">💰</span>
                        {job.salary}
                      </div>
                    )}

                    {job.skills && job.skills.length > 0 && (
                      <div className="job-skills">
                        {job.skills.slice(0, 3).map((skill, index) => (
                          <span key={index} className="skill-tag">
                            {skill}
                          </span>
                        ))}
                        {job.skills.length > 3 && (
                          <span className="skill-more">+{job.skills.length - 3}</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="card-footer">
                    <div className="footer-info">
                      <div className="footer-date">
                        <span>📅</span>
                        <span>Créé le {new Date(job.createdAt || job.postedAt).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className="footer-status">
                        <span>🟢</span>
                        <span className="status-active">Offre active</span>
                      </div>
                    </div>
                    <Link to={`/admin/jobs/edit/${job._id}`} className="edit-link">
                      Modifier l'offre
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal de confirmation de suppression */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3>Confirmer la suppression</h3>
            </div>
            
            <div className="modal-body">
              <p>Êtes-vous sûr de vouloir supprimer cette offre d'emploi ? Cette action est irréversible.</p>
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