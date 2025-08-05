import React from "react";
import "./Home.css";
import heroVideo from "../assets/hero-video.mp4";
import teamworkImg from "../assets/teamwork.jpg";

// Importez les images pour la section Secteurs d'activités
import AutomobileImg from "../assets/Automobile.jpg";
import AeronauticsImg from "../assets/Aeronautics.png";
import FerroviaireImg from "../assets/Ferroviaire.jpg";
import SpatialImg from "../assets/Spatial.jpg";
import MilitaryImg from "../assets/Military.jpg";
import EnergyImg from "../assets/Energy.png";
import ITImg from "../assets/IT.png";
import SanteImg from "../assets/Sante.jpg";
// import TransportationImg from "../assets/Transportation.jpg"; // Pas directement utilisée comme carte individuelle

const Home = () => {
  return (
    <div className="home-container">
      {/* SECTION VIDÉO AVEC DEUX BLOCS (inchangée) */}
      <section className="hero-section">
        <video autoPlay muted loop className="hero-video" disablePictureInPicture >
          <source src={heroVideo} type="video/mp4" />
        </video>

        <div className="hero-overlay">
          <h1 className="highlight-text">
            {"Bienvenue chez ENG R&D".split("").map((char, i) => (
              <span key={i}>{char}</span>
            ))}
          </h1>
          <p>
            Votre partenaire en ingénierie automobile, expert en systèmes
            embarqués, modélisation et validation.
          </p>
        </div>

        <div className="presentation-overlay">
          <div className="text-side">
            <h2>Votre partenaire en ingénierie automobile</h2>
            <p>
              Depuis 2018 à Casablanca, ENG R&D propose des solutions de
              modélisation, simulation et logiciels embarqués.
            </p>
            <p>
              Nous engageons performance, innovation et qualité dans tous nos
              projets.
            </p>
          </div>
          <div className="image-side">
            <img src={teamworkImg} alt="ENG R&D Teamwork" />
          </div>
        </div>
      </section>

      {/* SECTION "QUI SOMMES NOUS" avec le nouveau design */}
      <section id="about" className="about-section">
        <div className="about-container">
          <div className="about-header">
            <h2 className="about-title">Qui sommes  <span className="text-primary-expertise">nous</span></h2>
            <p className="about-description">
              Nous sommes une équipe passionnée et dévouée, spécialisée dans la création de solutions web sur mesure pour aider nos clients à atteindre leurs objectifs.
            </p>
          </div>
          <div className="about-cards-grid">
            {/* Carte 1 */}
            <div className="about-card">
              <div className="about-icon">💡</div>
              <h4>Innovation</h4>
              <p>Nous utilisons les dernières technologies pour concevoir des produits modernes et efficaces.</p>
            </div>
            {/* Carte 2 */}
            <div className="about-card">
              <div className="about-icon">🤝</div>
              <h4>Collaboration</h4>
              <p>Nous travaillons en étroite collaboration avec nos clients pour garantir leur entière satisfaction.</p>
            </div>
            {/* Carte 3 */}
            <div className="about-card">
              <div className="about-icon">🏆</div>
              <h4>Qualité</h4>
              <p>Notre engagement est de fournir des services de la plus haute qualité à chaque projet.</p>
            </div>
          </div>
        </div>
      </section>
 {/* SECTION NOTRE EXPERTISE (modifiée : toutes les cartes blanches avec icônes vertes) */}
<section className="expertise-section" id="expertise">
  <div className="expertise-header">
    <p className="expertise-pre-title">NOTRE EXPERTISE</p>
    <h2 className="expertise-main-title">
      Vous accompagner <span className="text-primary-expertise">dans vos projets</span>
    </h2>
  </div>
  <div className="expertise-card-container">
    {/* Carte 1: Conception */}
    <div className="expertise-card">
      <div className="expertise-icon-circle">
        {/* Icône Conception */}
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-compass">
          <circle cx="12" cy="12" r="10"></circle>
          <polygon points="16.24 7.56 14.73 14.73 7.56 16.24 9.07 9.07 16.24 7.56"></polygon>
        </svg>
      </div>
      <p className="expertise-card-text">Conception</p>
    </div>

    {/* Carte 2: Développement */}
    <div className="expertise-card">
      <div className="expertise-icon-circle">
        {/* Icône Développement */}
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-activity">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
      </div>
      <p className="expertise-card-text">Développement</p>
    </div>

    {/* Carte 3: Qualité /HSE/sureté de fonctionnement */}
    <div className="expertise-card">
      <div className="expertise-icon-circle">
        {/* Icône Pilotage de projet (réutilisée pour Qualité) */}
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-calendar">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      </div>
      <p className="expertise-card-text">Qualité / HSE / sûreté de fonctionnement</p>
    </div>

    {/* Carte 4: Soft embarqué */}
    <div className="expertise-card">
      <div className="expertise-icon-circle">
        {/* Icône Achat (réutilisée pour Soft embarqué) */}
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-package">
          <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
      </div>
      <p className="expertise-card-text">Soft embarqué</p>
    </div>

    {/* La carte "Costing" a été supprimée ici */}

  </div>
</section>

      {/* NOUVELLE SECTION: SECTEURS D'ACTIVITÉS (PLACÉE AVANT VALEURS) */}
      <section className="sectors-section" id="secteurs-activites">
        <div className="sectors-header">
          <p className="sectors-pre-title">NOS DOMAINES D'APPLICATION</p>
          <h2 className="sectors-main-title">
            Secteurs d'<span className="text-primary-sectors">activités</span>
          </h2>
        </div>
        <div className="sectors-grid-container">
          {/* Rubrique Transport */}
          <div className="sector-category">
            <h3>Transport</h3>
            <div className="sector-subgrid">
              <div className="sector-card">
                <img src={AutomobileImg} alt="Automobile" />
                <div className="sector-overlay">
                  <p>Automobile</p>
                </div>
              </div>
              <div className="sector-card">
                <img src={AeronauticsImg} alt="Aéronautique" />
                <div className="sector-overlay">
                  <p>Aéronautique</p>
                </div>
              </div>
              <div className="sector-card">
                <img src={FerroviaireImg} alt="Ferroviaire" />
                <div className="sector-overlay">
                  <p>Ferroviaire</p>
                </div>
              </div>
              <div className="sector-card">
                <img src={SpatialImg} alt="Spatial" />
                <div className="sector-overlay">
                  <p>Spatial</p>
                </div>
              </div>
              <div className="sector-card">
                <img src={MilitaryImg} alt="Militaire" />
                <div className="sector-overlay">
                  <p>Militaire</p>
                </div>
              </div>
            </div>
          </div>

          {/* Rubriques Énergie, Santé, IT sur la même ligne */}
          <div className="sector-category sector-category-aligned">
            {/* Conteneur pour les titres alignés */}
            <div className="aligned-titles">
                <h3>Énergie</h3>
                <h3>Santé</h3>
                <h3>IT</h3>
            </div>
            <div className="sector-subgrid aligned-cards-grid">
                <div className="sector-card">
                  <img src={EnergyImg} alt="Énergie" />
                  <div className="sector-overlay">
                    <p>Énergie</p>
                  </div>
                </div>
                <div className="sector-card">
                  <img src={SanteImg} alt="Santé" />
                  <div className="sector-overlay">
                    <p>Santé</p>
                  </div>
                </div>
                <div className="sector-card">
                  <img src={ITImg} alt="IT" />
                  <div className="sector-overlay">
                    <p>IT</p>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION VALEURS (Modifiée pour le nouveau design du texte) */}
      <section className="section bg-light" id="valeurs">
        <div className="values-header">
          <h2>Nos engagements, <span className="text-primary">nos valeurs</span></h2>
          <p>Notre engagement : Placer l'humain au cœur de nos projets</p>
          <p>
            Nous croyons que l’éthique, le respect et l’intégrité sont des piliers fondamentaux pour des relations saines et durables. Nous plaçons l’humain au centre de nos préoccupations, en favorisant une communication transparente et des pratiques justes.
          </p>
        </div>
        <div className="card-grid">
          {/* Vos cartes de valeurs existantes restent ici */}
          <div className="card">
            <h3>Satisfaction Client</h3>
            <p>Garantir un accompagnement fiable et un service de qualité.</p>
          </div>
          <div className="card">
            <h3>Respect</h3>
            <p>
              Un climat de confiance et de bienveillance avec nos partenaires.
            </p>
          </div>
          <div className="card">
            <h3>Professionnalisme</h3>
            <p>Rigueur, expertise et engagement au quotidien.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;