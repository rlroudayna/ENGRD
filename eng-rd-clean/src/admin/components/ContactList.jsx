// src/admin/components/ContactList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminStyles.css'; // Assurez-vous que ce fichier existe

export default function ContactList() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        // ⭐ Correction : L'API pour les messages admin est /api/admin/messages
        const response = await axios.get('http://localhost:5000/api/admin/messages');
        setContacts(response.data);
      } catch (err) {
        console.error("Erreur lors de la récupération des messages :", err);
        setError("Impossible de charger les messages. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  // ⭐ Nouveau : Fonction pour supprimer un message
  const handleDelete = async (id) => {
    // ⭐ Important : Remplacez window.confirm par un modal personnalisé
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/messages/${id}`);
        setContacts(contacts.filter(contact => contact._id !== id));
        // ⭐ Important : Remplacez alert par un modal personnalisé
        alert("Message supprimé avec succès !");
      } catch (err) {
        console.error("Erreur lors de la suppression du message :", err);
        // ⭐ Important : Remplacez alert par un modal personnalisé
        alert("Erreur lors de la suppression du message.");
      }
    }
  };

  if (loading) {
    return <div className="admin-main">Chargement des messages...</div>;
  }

  if (error) {
    return <div className="admin-main" style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div className="admin-main">
      <h2>Messages reçus</h2>
      {contacts.length === 0 ? (
        <p>Aucun message disponible pour le moment.</p>
      ) : (
        <ul className="admin-list">
          {contacts.map(contact => (
            <li key={contact._id}>
              <strong>{contact.name}</strong> – {contact.email}
              <p>Sujet : {contact.subject}</p>
              <p>Message : {contact.message}</p>
              <div>
                {/* ⭐ Nouveau : Bouton pour supprimer */}
                <button onClick={() => handleDelete(contact._id)} className="delete">Supprimer</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}