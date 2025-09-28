import React from "react";
import "./Home.css";
import heroVideo from "../assets/hero-video.mp4";
import teamworkImg from "../assets/teamwork.jpg";
import { useHomeContent } from "../hooks/useHomeContent";

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
  const { getContent, loading } = useHomeContent();

  // Default content
  const defaultHeroContent = {
    title: "Bienvenue chez ENG R&D",
    subtitle: "Votre partenaire en ingénierie automobile, expert en systèmes embarqués, modélisation et validation.",
    presentationTitle: "Votre partenaire en ingénierie automobile",
    presentationText1: "Depuis 2018 à Casablanca, ENG R&D propose des solutions de modélisation, simulation et logiciels embarqués.",
    presentationText2: "Nous engageons performance, innovation et qualité dans tous nos projets."
  };

  const defaultAboutContent = {
    title: "Qui sommes nous",
    description: "Nous sommes une équipe passionnée et dévouée, spécialisée dans la création de solutions web sur mesure pour aider nos clients à atteindre leurs objectifs.",
    cards: [
      {
        icon: "💡",
        title: "Innovation",
        description: "Nous utilisons les dernières technologies pour concevoir des produits modernes et efficaces."
      },
      {
        icon: "🤝",
        title: "Collaboration",
        description: "Nous travaillons en étroite collaboration avec nos clients pour garantir leur entière satisfaction."
      },
      {
        icon: "🏆",
        title: "Qualité",
        description: "Notre engagement est de fournir des services de la plus haute qualité à chaque projet."
      }
    ]
  };

  const defaultExpertiseContent = {
    preTitle: "NOTRE EXPERTISE",
    title: "Vous accompagner dans vos projets",
    cards: [
      { text: "Conception" },
      { text: "Développement" },
      { text: "Qualité / HSE / sûreté de fonctionnement" },
      { text: "Soft embarqué" }
    ]
  };

  const defaultSectorsContent = {
    preTitle: "NOS DOMAINES D'APPLICATION",
    title: "Secteurs d'activités",
    transport: {
      title: "Transport",
      cards: [
        { name: "Automobile", image: { url: AutomobileImg, alt: "Automobile", link: "/jobs?sector=automobile" } },
        { name: "Aéronautique", image: { url: AeronauticsImg, alt: "Aéronautique", link: "/jobs?sector=aeronautique" } },
        { name: "Ferroviaire", image: { url: FerroviaireImg, alt: "Ferroviaire", link: "/jobs?sector=ferroviaire" } },
        { name: "Spatial", image: { url: SpatialImg, alt: "Spatial", link: "/jobs?sector=spatial" } },
        { name: "Militaire", image: { url: MilitaryImg, alt: "Militaire", link: "/jobs?sector=militaire" } }
      ]
    },
    other: [
      { name: "Énergie", image: { url: EnergyImg, alt: "Énergie", link: "/jobs?sector=energie" } },
      { name: "Santé", image: { url: SanteImg, alt: "Santé", link: "/jobs?sector=sante" } },
      { name: "IT", image: { url: ITImg, alt: "IT", link: "/jobs?sector=it" } }
    ]
  };

  const defaultValuesContent = {
    title: "Nos engagements, nos valeurs",
    subtitle: "Notre engagement : Placer l'humain au cœur de nos projets",
    description: "Nous croyons que l'éthique, le respect et l'intégrité sont des piliers fondamentaux pour des relations saines et durables. Nous plaçons l'humain au centre de nos préoccupations, en favorisant une communication transparente et des pratiques justes.",
    cards: [
      {
        title: "Satisfaction Client",
        description: "Garantir un accompagnement fiable et un service de qualité."
      },
      {
        title: "Respect",
        description: "Un climat de confiance et de bienveillance avec nos partenaires."
      },
      {
        title: "Professionnalisme",
        description: "Rigueur, expertise et engagement au quotidien."
      }
    ]
  };

  // Get dynamic content with fallbacks
  const heroContent = getContent('hero', defaultHeroContent);
  const aboutContent = getContent('about', defaultAboutContent);
  const expertiseContent = getContent('expertise', defaultExpertiseContent);
  const sectorsContent = getContent('sectors', defaultSectorsContent);
  const valuesContent = getContent('values', defaultValuesContent);

  if (loading) {
    return (
      <div className="home-container">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* SECTION VIDÉO AVEC DEUX BLOCS (inchangée) */}
      <section className="hero-section">
        <video autoPlay muted loop className="hero-video" disablePictureInPicture >
          <source src={heroContent.heroVideo?.url || heroContent.heroVideo || heroVideo} type="video/mp4" />
        </video>

        <div className="hero-overlay">
          <h1 className="highlight-text">
            {heroContent.title.split("").map((char, i) => (
              <span key={i}>{char}</span>
            ))}
          </h1>
          <p>
            {heroContent.subtitle}
          </p>
        </div>

        <div className="presentation-overlay">
          <div className="text-side">
            <h2>{heroContent.presentationTitle}</h2>
            <p>
              {heroContent.presentationText1}
            </p>
            <p>
              {heroContent.presentationText2}
            </p>
          </div>
          <div className="image-side">
            {heroContent.teamworkImage?.link ? (
              <a href={heroContent.teamworkImage.link}>
                <img 
                  src={heroContent.teamworkImage?.url || heroContent.teamworkImage || teamworkImg} 
                  alt={heroContent.teamworkImage?.alt || "ENG R&D Teamwork"} 
                />
              </a>
            ) : (
              <img 
                src={heroContent.teamworkImage?.url || heroContent.teamworkImage || teamworkImg} 
                alt={heroContent.teamworkImage?.alt || "ENG R&D Teamwork"} 
              />
            )}
          </div>
        </div>
      </section>

      {/* SECTION "QUI SOMMES NOUS" avec le nouveau design */}
      <section id="about" className="about-section">
        <div className="about-container">
          <div className="about-header">
            <h2 className="about-title">{aboutContent.title.split(' ').map((word, index, array) => 
              index === array.length - 1 ? 
                <span key={index} className="text-primary-expertise">{word}</span> : 
                word + ' '
            )}</h2>
            <p className="about-description">
              {aboutContent.description}
            </p>
          </div>
          <div className="about-cards-grid">
            {aboutContent.cards.map((card, index) => (
              <div key={index} className="about-card">
                <div className="about-icon">{card.icon}</div>
                <h4>{card.title}</h4>
                <p>{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
 {/* SECTION NOTRE EXPERTISE (modifiée : toutes les cartes blanches avec icônes vertes) */}
<section className="expertise-section" id="expertise">
  <div className="expertise-header">
    <p className="expertise-pre-title">{expertiseContent.preTitle}</p>
    <h2 className="expertise-main-title">
      {expertiseContent.title.split(' ').slice(0, 2).join(' ')} <span className="text-primary-expertise">{expertiseContent.title.split(' ').slice(2).join(' ')}</span>
    </h2>
  </div>
  <div className="expertise-card-container">
    {expertiseContent.cards.map((card, index) => {
      const icons = [
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-compass">
          <circle cx="12" cy="12" r="10"></circle>
          <polygon points="16.24 7.56 14.73 14.73 7.56 16.24 9.07 9.07 16.24 7.56"></polygon>
        </svg>,
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-activity">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>,
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-calendar">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>,
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-package">
          <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
      ];
      
      return (
        <div key={index} className="expertise-card">
          <div className="expertise-icon-circle">
            {icons[index] || icons[0]}
          </div>
          <p className="expertise-card-text">{card.text}</p>
        </div>
      );
    })}
  </div>
</section>

      {/* NOUVELLE SECTION: SECTEURS D'ACTIVITÉS (PLACÉE AVANT VALEURS) */}
      <section className="sectors-section" id="secteurs-activites">
        <div className="sectors-header">
          <p className="sectors-pre-title">{sectorsContent.preTitle}</p>
          <h2 className="sectors-main-title">
            {sectorsContent.title.split(' ')[0]} d'<span className="text-primary-sectors">{sectorsContent.title.split(' ')[1]}</span>
          </h2>
        </div>
        <div className="sectors-grid-container">
          {/* Rubrique Transport */}
          <div className="sector-category">
            <h3>{sectorsContent.transport?.title || 'Transport'}</h3>
            <div className="sector-subgrid">
              {sectorsContent.transport?.cards?.map((card, index) => (
                <div key={index} className="sector-card">
                  {card.image?.link ? (
                    <a href={card.image.link}>
                      <img src={card.image?.url || card.image} alt={card.image?.alt || card.name} />
                      <div className="sector-overlay">
                        <p>{card.name}</p>
                      </div>
                    </a>
                  ) : (
                    <>
                      <img src={card.image?.url || card.image} alt={card.image?.alt || card.name} />
                      <div className="sector-overlay">
                        <p>{card.name}</p>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Rubriques Énergie, Santé, IT sur la même ligne */}
          <div className="sector-category sector-category-aligned">
            {/* Conteneur pour les titres alignés */}
            <div className="aligned-titles">
              {sectorsContent.other?.map((card, index) => (
                <h3 key={index}>{card.name}</h3>
              ))}
            </div>
            <div className="sector-subgrid aligned-cards-grid">
              {sectorsContent.other?.map((card, index) => (
                <div key={index} className="sector-card">
                  {card.image?.link ? (
                    <a href={card.image.link}>
                      <img src={card.image?.url || card.image} alt={card.image?.alt || card.name} />
                      <div className="sector-overlay">
                        <p>{card.name}</p>
                      </div>
                    </a>
                  ) : (
                    <>
                      <img src={card.image?.url || card.image} alt={card.image?.alt || card.name} />
                      <div className="sector-overlay">
                        <p>{card.name}</p>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION VALEURS (Modifiée pour le nouveau design du texte) */}
      <section className="section bg-light" id="valeurs">
        <div className="values-header">
          <h2>{valuesContent.title.split(',')[0]}, <span className="text-primary">{valuesContent.title.split(',')[1]}</span></h2>
          <p>{valuesContent.subtitle}</p>
          <p>
            Nous croyons que l’éthique, le respect et l’intégrité sont des piliers fondamentaux pour des relations saines et durables. Nous plaçons l’humain au centre de nos préoccupations, en favorisant une communication transparente et des pratiques justes.
          </p>
        </div>
        <div className="card-grid">
          {valuesContent.cards.map((card, index) => (
            <div key={index} className="card">
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;