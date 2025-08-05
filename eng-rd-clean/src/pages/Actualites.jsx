// src/pages/Actualites.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // ⭐ NOUVEAU : Importe Link pour les liens "Voir plus"
import '../App.css'; // Assurez-vous d'avoir un fichier App.css pour les styles généraux

export default function Actualites() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/news');
        setNews(response.data);
      } catch (err) {
        console.error("Erreur lors de la récupération des actualités :", err);
        setError("Impossible de charger les actualités pour le moment. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return <div className="page-content">Chargement des actualités...</div>;
  }

  if (error) {
    return <div className="page-content error-message">{error}</div>;
  }

  return (
    <div className="page-content">
      <h1 className="page-title">Nos Actualités </h1>
      {news.length === 0 ? (
        <p className="no-content-message">Aucune actualité n'est disponible pour le moment. Revenez bientôt !</p>
      ) : (
        <div className="news-grid">
          {news.map((item) => (
            <div key={item._id} className="news-card">
              {item.imageUrl && (
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="news-image" 
                  onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/400x250/cccccc/333333?text=Image+non+disponible"; }} // Image de secours
                />
              )}
              <div className="card-content">
                <h2 className="card-title">{item.title}</h2>
                <p className="card-date">Publié le : {new Date(item.publishedAt).toLocaleDateString('fr-FR')}</p>
                <p className="card-description">{item.content.substring(0, 150)}...</p> {/* Affiche un extrait */}
                {/* ⭐ NOUVEAU : Lien "Voir plus" vers la page de détail */}
                <Link to={`/news/${item._id}`} className="read-more-button">Voir plus</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}