// src/admin/components/ContactList.jsx
import React, { useEffect, useState } from 'react';
import { adminClient } from '../../utils/axiosConfig';
import './AdminStyles.css'; // Assurez-vous que ce fichier existe

export default function ContactList() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Limite de caractères pour l'aperçu du message
  const MESSAGE_PREVIEW_LIMIT = 100;

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        // ⭐ Correction : L'API pour les messages admin est /api/admin/messages
        const response = await adminClient.get('/admin/messages');
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

  // Fonction pour tronquer le message
  const truncateMessage = (message) => {
    if (message.length <= MESSAGE_PREVIEW_LIMIT) {
      return message;
    }
    return message.substring(0, MESSAGE_PREVIEW_LIMIT) + '...';
  };

  // Fonction pour afficher les détails du message
  const handleViewDetails = (contact) => {
    setSelectedMessage(contact);
    setShowModal(true);
  };

  // Fonction pour fermer la modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedMessage(null);
  };

  // ⭐ Nouveau : Fonction pour supprimer un message
  const handleDelete = async (id) => {
    // ⭐ Important : Remplacez window.confirm par un modal personnalisé
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) {
      try {
        await adminClient.delete(`/admin/messages/${id}`);
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
        <p className="no-content-message">Aucun message disponible pour le moment.</p>
      ) : (
        <div className="messages-grid">
          {contacts.map(contact => (
            <div key={contact._id} className="message-card">
              <div className="message-header">
                <div className="sender-info">
                  <h3 className="sender-name">{contact.name}</h3>
                  <p className="sender-email">{contact.email}</p>
                </div>
                <div className="message-date">
                  {contact.createdAt && new Date(contact.createdAt).toLocaleDateString('fr-FR')}
                </div>
              </div>
              
              <div className="message-content">
                <div className="message-subject">
                  <strong>Sujet :</strong> {contact.subject}
                </div>
                <div className="message-preview">
                  <strong>Message :</strong> {truncateMessage(contact.message)}
                </div>
              </div>
              
              <div className="message-actions">
                <button 
                  onClick={() => handleViewDetails(contact)} 
                  className="view-details-btn"
                >
                  Voir détails
                </button>
                <button 
                  onClick={() => handleDelete(contact._id)} 
                  className="delete"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal pour afficher les détails complets du message */}
      {showModal && selectedMessage && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeModal}>×</button>
            <h3>Détails du message</h3>
            
            <div className="message-details">
              <p><strong>Nom :</strong> {selectedMessage.name}</p>
              <p><strong>Email :</strong> {selectedMessage.email}</p>
              <p><strong>Sujet :</strong> {selectedMessage.subject}</p>
              <p><strong>Date :</strong> {selectedMessage.createdAt && new Date(selectedMessage.createdAt).toLocaleString('fr-FR')}</p>
              
              <div className="full-message">
                <strong>Message complet :</strong>
                <div className="message-text">
                  {selectedMessage.message}
                </div>
              </div>
            </div>
            
            <div className="modal-buttons">
              <button className="cancel-button" onClick={closeModal}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}