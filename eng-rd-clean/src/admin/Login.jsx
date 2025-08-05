// src/admin/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './components/AdminStyles.css'; // assure-toi du bon chemin

export default function Login() {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const adminPassword = 'admin123'; // mot de passe simple, à changer plus tard

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === adminPassword) {
      navigate('/admin/dashboard');
    } else {
      alert('Mot de passe incorrect');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2>Connexion Admin</h2>
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
}
