// src/admin/components/NewsList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminStyles.css'; // Assurez-vous que ce fichier existe

export default function NewsList() {
  const [news, setNews] = useState([]);
  const [newNews, setNewNews] = useState({ title: '', content: '', imageUrl: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/news');
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewNews(prev => ({ ...prev, [name]: value }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newNews.title || !newNews.content) {
      alert("Veuillez saisir un titre et un contenu pour l'actualité.");
      return;
    }
    try {
      const res = await axios.post('http://localhost:5000/api/admin/news', newNews);
      setNews([...news, res.data]);
      setNewNews({ title: '', content: '', imageUrl: '' });
      alert("Actualité ajoutée avec succès !");
    } catch (err) {
      console.error("Erreur lors de l'ajout de l'actualité :", err);
      alert("Erreur lors de l'ajout de l'actualité.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette actualité ?")) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/news/${id}`);
        setNews(news.filter(n => n._id !== id));
        alert("Actualité supprimée avec succès !");
      } catch (err) {
        console.error("Erreur lors de la suppression de l'actualité :", err);
        alert("Erreur lors de la suppression de l'actualité.");
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
                {/* Vous pouvez ajouter un lien pour modifier l'actualité ici si vous avez un composant EditNewsForm */}
                {/* <Link to={`/admin/news/edit/${n._id}`} className="edit">Modifier</Link> */}
                <button onClick={() => handleDelete(n._id)} className="delete">Supprimer</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}