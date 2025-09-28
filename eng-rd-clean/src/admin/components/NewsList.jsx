// src/admin/components/NewsList.jsx
import { useState, useEffect } from 'react';
import { adminClient } from '../../utils/axiosConfig';
import './AdminStyles.css'; // Assurez-vous que ce fichier existe

export default function NewsList() {
  const [news, setNews] = useState([]);
  const [newNews, setNewNews] = useState({ title: '', content: '', imageUrl: '' });
  const [editingNews, setEditingNews] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', content: '', imageUrl: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await adminClient.get('/admin/news');
        setNews(response.data);
      } catch (err) {
        console.error("Erreur lors de la récupération des actualités :", err);
        setError("Impossible de charger les actualités. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewNews(prev => ({ ...prev, [name]: value }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newNews.title || !newNews.content) {
      showNotification("Veuillez saisir un titre et un contenu pour l'actualité.", 'error');
      return;
    }
    try {
      const res = await adminClient.post('/admin/news', newNews);
      setNews([...news, res.data]);
      setNewNews({ title: '', content: '', imageUrl: '' });
      showNotification("Actualité ajoutée avec succès !");
    } catch (err) {
      console.error("Erreur lors de l'ajout de l'actualité :", err);
      showNotification("Erreur lors de l'ajout de l'actualité.", 'error');
    }
  };

  const handleEdit = (newsItem) => {
    setEditingNews(newsItem);
    setEditForm({
      title: newsItem.title,
      content: newsItem.content,
      imageUrl: newsItem.imageUrl || ''
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editForm.title || !editForm.content) {
      showNotification("Veuillez saisir un titre et un contenu pour l'actualité.", 'error');
      return;
    }
    try {
      const res = await adminClient.put(`/admin/news/${editingNews._id}`, editForm);
      setNews(news.map(n => n._id === editingNews._id ? res.data : n));
      setEditingNews(null);
      setEditForm({ title: '', content: '', imageUrl: '' });
      showNotification("Actualité modifiée avec succès !");
    } catch (err) {
      console.error("Erreur lors de la modification de l'actualité :", err);
      showNotification(`Erreur lors de la modification: ${err.response?.data?.message || err.message}`, 'error');
    }
  };

  const handleCancelEdit = () => {
    setEditingNews(null);
    setEditForm({ title: '', content: '', imageUrl: '' });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette actualité ?")) {
      try {
        await adminClient.delete(`/admin/news/${id}`);
        setNews(news.filter(n => n._id !== id));
        showNotification("Actualité supprimée avec succès !");
      } catch (err) {
        console.error("Erreur lors de la suppression de l'actualité :", err);
        showNotification("Erreur lors de la suppression de l'actualité.", 'error');
      }
    }
  };

  if (loading) {
    return (
      <div className="admin-main">
        <div className="loading-spinner"></div>
        <p>Chargement des actualités...</p>
      </div>
    );
  }

  if (error) {
    return <div className="admin-main error-message">{error}</div>;
  }

  return (
    <div className="admin-main">
      <h2>Gestion des Actualités</h2>
      
      {/* Toast Notification */}
      {notification && (
        <div className={`toast-notification ${notification.type}`}>
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="toast-close">&times;</button>
        </div>
      )}
      {/* Formulaire d'ajout d'actualité */}
      <form onSubmit={handleAdd} className="news-form"> {/* ⭐ Utilise la classe news-form */}
        <div className="form-group"> {/* ⭐ Utilise la classe form-group */}
          <label htmlFor="newsTitle">Titre de l'actualité</label>
          <input 
            type="text" 
            id="newsTitle" 
            name="title" 
            value={newNews.title} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className="form-group"> {/* ⭐ Utilise la classe form-group */}
          <label htmlFor="newsContent">Contenu de l'actualité</label>
          <textarea 
            id="newsContent" 
            name="content" 
            value={newNews.content} 
            onChange={handleChange} 
            rows="4" 
            required
          ></textarea>
        </div>

        
        <button type="submit" className="add-button">Ajouter</button>
      </form>

      {news.length === 0 ? (
        <p className="no-content-message">Aucune actualité disponible pour le moment.</p>
      ) : (
        <ul className="admin-list">
          {news.map(n => (
            <li key={n._id}>
              {/* Conteneur pour le texte de l'actualité */}
              <div className="list-text-content"> 
                <strong>{n.title}</strong>
                <p>{n.content.substring(0, 100)}...</p>
                {n.imageUrl && <p><img src={n.imageUrl} alt="Actualité" style={{maxWidth: '100px', maxHeight: '100px', borderRadius: '5px', marginTop: '5px'}} onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/100x100/cccccc/333333?text=No+Image"; }}/></p>}
                <p className="application-date">Publié le: {new Date(n.publishedAt).toLocaleDateString('fr-FR')}</p>
              </div>
              {/* Conteneur pour les boutons d'action */}
              <div className="list-action-buttons"> 
                <button onClick={() => handleEdit(n)} className="edit">Modifier</button>
                <button onClick={() => handleDelete(n._id)} className="delete">Supprimer</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Modal de modification d'actualité */}
      {editingNews && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close-btn" onClick={handleCancelEdit}>&times;</button>
            <h3>Modifier l'Actualité</h3>
            <form onSubmit={handleEditSubmit} className="news-form">
              <div className="form-group">
                <label htmlFor="editTitle">Titre de l'actualité</label>
                <input 
                  type="text" 
                  id="editTitle" 
                  name="title" 
                  value={editForm.title} 
                  onChange={handleEditChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="editContent">Contenu de l'actualité</label>
                <textarea 
                  id="editContent" 
                  name="content" 
                  value={editForm.content} 
                  onChange={handleEditChange} 
                  rows="6" 
                  required
                ></textarea>
              </div>

              <div className="modal-buttons">
                <button type="submit" className="save-button">Sauvegarder</button>
                <button type="button" onClick={handleCancelEdit} className="cancel-button">Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}