import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import logo from "../assets/Logo.png"; // Assure-toi que ce chemin est correct

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-left">
          <img src={logo} alt="ENG R&D" className="footer-logo" />
          <p className="footer-email">
            <a href="mailto:contact@engrd.com">contact@engrd.com</a>
          </p>
        </div>

        <div className="footer-links">
          <Link to="/">Accueil</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/news">Actualité</Link>
          <Link to="/jobs">Carrière</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 ENG R&D. Tous droits réservés.</p>
      </div>
    </footer>
  );
};

export default Footer;
