import React, { useState, useEffect } from 'react';
import { adminClient } from '../../utils/axiosConfig';
import VideoUpload from './VideoUpload';
import ImageUpload from './ImageUpload';
import './AdminStyles.css';

const HomeContentEditor = () => {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const sections = [
    { key: 'hero', label: 'Section Héro' },
    { key: 'about', label: 'Qui sommes-nous' },
    { key: 'expertise', label: 'Notre Expertise' },
    { key: 'sectors', label: 'Secteurs d\'activités' },
    { key: 'values', label: 'Nos Valeurs' }
  ];

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      console.log('Fetching content for admin editor...');
      const response = await adminClient.get('/admin/home-content');
      
      // Handle both old and new response formats
      const data = response.data.data || response.data;
      
      if (!data || !Array.isArray(data)) {
        throw new Error('Format de données invalide');
      }
      
      const contentMap = {};
      data.forEach(item => {
        contentMap[item.section] = item.content;
      });
      
      console.log(`Successfully loaded ${Object.keys(contentMap).length} sections for editing`);
      setContent(contentMap);
    } catch (error) {
      console.error('Erreur lors du chargement du contenu:', error);
      alert('Erreur lors du chargement du contenu: ' + (error.message || 'Erreur inconnue'));
    } finally {
      setLoading(false);
    }
  };

  const saveSection = async (section, sectionContent) => {
    setSaving(true);
    try {
      console.log(`Saving section: ${section}`);
      const response = await adminClient.put(`/admin/home-content/${section}`, {
        content: sectionContent
      });
      
      // Update local state
      setContent(prev => ({
        ...prev,
        [section]: sectionContent
      }));
      
      const message = response.data?.message || 'Section sauvegardée avec succès!';
      console.log(`Successfully saved section: ${section}`);
      alert(message);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la sauvegarde';
      alert('Erreur: ' + errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const renderHeroEditor = () => {
    const heroContent = content.hero || {
      title: "Bienvenue chez ENG R&D",
      subtitle: "Votre partenaire en ingénierie automobile, expert en systèmes embarqués, modélisation et validation.",
      presentationTitle: "Votre partenaire en ingénierie automobile",
      presentationText1: "Depuis 2018 à Casablanca, ENG R&D propose des solutions de modélisation, simulation et logiciels embarqués.",
      presentationText2: "Nous engageons performance, innovation et qualité dans tous nos projets.",
      heroVideo: {
        url: "/assets/hero-video.mp4",
        alt: "Vidéo de présentation ENG R&D"
      },
      teamworkImage: {
        url: "/assets/teamwork.jpg",
        alt: "Image équipe ENG R&D au travail",
        link: "/contact"
      }
    };

    return (
      <div className="content-editor">
        <h3>Section Héro</h3>
        <div className="form-group">
          <label>Titre principal:</label>
          <input
            type="text"
            value={heroContent.title}
            onChange={(e) => setContent(prev => ({
              ...prev,
              hero: { ...heroContent, title: e.target.value }
            }))}
          />
        </div>
        <div className="form-group">
          <label>Sous-titre:</label>
          <textarea
            value={heroContent.subtitle}
            onChange={(e) => setContent(prev => ({
              ...prev,
              hero: { ...heroContent, subtitle: e.target.value }
            }))}
          />
        </div>
        <div className="form-group">
          <label>Titre de présentation:</label>
          <input
            type="text"
            value={heroContent.presentationTitle}
            onChange={(e) => setContent(prev => ({
              ...prev,
              hero: { ...heroContent, presentationTitle: e.target.value }
            }))}
          />
        </div>
        <div className="form-group">
          <label>Texte de présentation 1:</label>
          <textarea
            value={heroContent.presentationText1}
            onChange={(e) => setContent(prev => ({
              ...prev,
              hero: { ...heroContent, presentationText1: e.target.value }
            }))}
          />
        </div>
        <div className="form-group">
          <label>Texte de présentation 2:</label>
          <textarea
            value={heroContent.presentationText2}
            onChange={(e) => setContent(prev => ({
              ...prev,
              hero: { ...heroContent, presentationText2: e.target.value }
            }))}
          />
        </div>
        
        <h4>Images et Médias:</h4>
        <div className="card-editor">
          <VideoUpload
            currentVideoUrl={heroContent.heroVideo?.url || heroContent.heroVideo || ''}
            onVideoUploaded={(url) => setContent(prev => ({
              ...prev,
              hero: { 
                ...heroContent, 
                heroVideo: typeof heroContent.heroVideo === 'object' 
                  ? { ...heroContent.heroVideo, url: url }
                  : { url: url, alt: "Vidéo de présentation héro" }
              }
            }))}
            onVideoRemoved={() => setContent(prev => ({
              ...prev,
              hero: { 
                ...heroContent, 
                heroVideo: typeof heroContent.heroVideo === 'object' 
                  ? { ...heroContent.heroVideo, url: '' }
                  : { url: '', alt: "Vidéo de présentation héro" }
              }
            }))}
            label="Vidéo Héro"
          />
          <div className="form-group">
            <label>Texte alternatif de la vidéo héro:</label>
            <input
              type="text"
              value={heroContent.heroVideo?.alt || ''}
              placeholder="Vidéo de présentation héro"
              onChange={(e) => setContent(prev => ({
                ...prev,
                hero: { 
                  ...heroContent, 
                  heroVideo: typeof heroContent.heroVideo === 'object' 
                    ? { ...heroContent.heroVideo, alt: e.target.value }
                    : { url: heroContent.heroVideo || '', alt: e.target.value }
                }
              }))}
            />
          </div>
        </div>
        
        <div className="card-editor">
          <ImageUpload
            currentImageUrl={heroContent.teamworkImage?.url || heroContent.teamworkImage || ''}
            onImageUploaded={(url) => setContent(prev => ({
              ...prev,
              hero: { 
                ...heroContent, 
                teamworkImage: typeof heroContent.teamworkImage === 'object' 
                  ? { ...heroContent.teamworkImage, url: url }
                  : { url: url, alt: "Image équipe au travail", link: "/contact" }
              }
            }))}
            onImageRemoved={() => setContent(prev => ({
              ...prev,
              hero: { 
                ...heroContent, 
                teamworkImage: typeof heroContent.teamworkImage === 'object' 
                  ? { ...heroContent.teamworkImage, url: '' }
                  : { url: '', alt: "Image équipe au travail", link: "/contact" }
              }
            }))}
            label="Image Teamwork"
            folder="engrd/teamwork"
          />
          <div className="form-group">
            <label>Texte alternatif de l'image:</label>
            <input
              type="text"
              value={heroContent.teamworkImage?.alt || ''}
              placeholder="Image équipe au travail"
              onChange={(e) => setContent(prev => ({
                ...prev,
                hero: { 
                  ...heroContent, 
                  teamworkImage: typeof heroContent.teamworkImage === 'object' 
                    ? { ...heroContent.teamworkImage, alt: e.target.value }
                    : { url: heroContent.teamworkImage || '', alt: e.target.value, link: "/contact" }
                }
              }))}
            />
          </div>
          <div className="form-group">
            <label>Lien de l'image (optionnel):</label>
            <input
              type="text"
              value={heroContent.teamworkImage?.link || ''}
              placeholder="/contact"
              onChange={(e) => setContent(prev => ({
                ...prev,
                hero: { 
                  ...heroContent, 
                  teamworkImage: typeof heroContent.teamworkImage === 'object' 
                    ? { ...heroContent.teamworkImage, link: e.target.value }
                    : { url: heroContent.teamworkImage || '', alt: "Image équipe au travail", link: e.target.value }
                }
              }))}
            />
          </div>
        </div>
        
        <button 
          onClick={() => saveSection('hero', content.hero || heroContent)}
          disabled={saving}
          className="btn btn-primary"
        >
          {saving ? 'Sauvegarde...' : 'Sauvegarder'}
        </button>
      </div>
    );
  };

  const renderAboutEditor = () => {
    const aboutContent = content.about || {
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

    return (
      <div className="content-editor">
        <h3>Section Qui sommes-nous</h3>
        <div className="form-group">
          <label>Titre:</label>
          <input
            type="text"
            value={aboutContent.title}
            onChange={(e) => setContent(prev => ({
              ...prev,
              about: { ...aboutContent, title: e.target.value }
            }))}
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            value={aboutContent.description}
            onChange={(e) => setContent(prev => ({
              ...prev,
              about: { ...aboutContent, description: e.target.value }
            }))}
          />
        </div>
        <h4>Cartes:</h4>
        {aboutContent.cards.map((card, index) => (
          <div key={index} className="card-editor">
            <div className="form-group">
              <label>Icône:</label>
              <input
                type="text"
                value={card.icon}
                onChange={(e) => {
                  const newCards = [...aboutContent.cards];
                  newCards[index].icon = e.target.value;
                  setContent(prev => ({
                    ...prev,
                    about: { ...aboutContent, cards: newCards }
                  }));
                }}
              />
            </div>
            <div className="form-group">
              <label>Titre:</label>
              <input
                type="text"
                value={card.title}
                onChange={(e) => {
                  const newCards = [...aboutContent.cards];
                  newCards[index].title = e.target.value;
                  setContent(prev => ({
                    ...prev,
                    about: { ...aboutContent, cards: newCards }
                  }));
                }}
              />
            </div>
            <div className="form-group">
              <label>Description:</label>
              <textarea
                value={card.description}
                onChange={(e) => {
                  const newCards = [...aboutContent.cards];
                  newCards[index].description = e.target.value;
                  setContent(prev => ({
                    ...prev,
                    about: { ...aboutContent, cards: newCards }
                  }));
                }}
              />
            </div>
          </div>
        ))}
        <button 
          onClick={() => saveSection('about', content.about || aboutContent)}
          disabled={saving}
          className="btn btn-primary"
        >
          {saving ? 'Sauvegarde...' : 'Sauvegarder'}
        </button>
      </div>
    );
  };

  const renderExpertiseEditor = () => {
    const expertiseContent = content.expertise || {
      preTitle: "NOTRE EXPERTISE",
      title: "Vous accompagner dans vos projets",
      cards: [
        { text: "Conception" },
        { text: "Développement" },
        { text: "Qualité / HSE / sûreté de fonctionnement" },
        { text: "Soft embarqué" }
      ]
    };

    return (
      <div className="content-editor">
        <h3>Section Notre Expertise</h3>
        <div className="form-group">
          <label>Pré-titre:</label>
          <input
            type="text"
            value={expertiseContent.preTitle}
            onChange={(e) => setContent(prev => ({
              ...prev,
              expertise: { ...expertiseContent, preTitle: e.target.value }
            }))}
          />
        </div>
        <div className="form-group">
          <label>Titre:</label>
          <input
            type="text"
            value={expertiseContent.title}
            onChange={(e) => setContent(prev => ({
              ...prev,
              expertise: { ...expertiseContent, title: e.target.value }
            }))}
          />
        </div>
        <h4>Cartes d'expertise:</h4>
        {expertiseContent.cards.map((card, index) => (
          <div key={index} className="form-group">
            <label>Carte {index + 1}:</label>
            <input
              type="text"
              value={card.text}
              onChange={(e) => {
                const newCards = [...expertiseContent.cards];
                newCards[index].text = e.target.value;
                setContent(prev => ({
                  ...prev,
                  expertise: { ...expertiseContent, cards: newCards }
                }));
              }}
            />
          </div>
        ))}
        <button 
          onClick={() => saveSection('expertise', content.expertise || expertiseContent)}
          disabled={saving}
          className="btn btn-primary"
        >
          {saving ? 'Sauvegarde...' : 'Sauvegarder'}
        </button>
      </div>
    );
  };

  const renderValuesEditor = () => {
    const valuesContent = content.values || {
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

    return (
      <div className="content-editor">
        <h3>Section Nos Valeurs</h3>
        <div className="form-group">
          <label>Titre:</label>
          <input
            type="text"
            value={valuesContent.title}
            onChange={(e) => setContent(prev => ({
              ...prev,
              values: { ...valuesContent, title: e.target.value }
            }))}
          />
        </div>
        <div className="form-group">
          <label>Sous-titre:</label>
          <input
            type="text"
            value={valuesContent.subtitle}
            onChange={(e) => setContent(prev => ({
              ...prev,
              values: { ...valuesContent, subtitle: e.target.value }
            }))}
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            value={valuesContent.description}
            onChange={(e) => setContent(prev => ({
              ...prev,
              values: { ...valuesContent, description: e.target.value }
            }))}
          />
        </div>
        <h4>Cartes de valeurs:</h4>
        {valuesContent.cards.map((card, index) => (
          <div key={index} className="card-editor">
            <div className="form-group">
              <label>Titre:</label>
              <input
                type="text"
                value={card.title}
                onChange={(e) => {
                  const newCards = [...valuesContent.cards];
                  newCards[index].title = e.target.value;
                  setContent(prev => ({
                    ...prev,
                    values: { ...valuesContent, cards: newCards }
                  }));
                }}
              />
            </div>
            <div className="form-group">
              <label>Description:</label>
              <textarea
                value={card.description}
                onChange={(e) => {
                  const newCards = [...valuesContent.cards];
                  newCards[index].description = e.target.value;
                  setContent(prev => ({
                    ...prev,
                    values: { ...valuesContent, cards: newCards }
                  }));
                }}
              />
            </div>
          </div>
        ))}
        <button 
          onClick={() => saveSection('values', content.values || valuesContent)}
          disabled={saving}
          className="btn btn-primary"
        >
          {saving ? 'Sauvegarde...' : 'Sauvegarder'}
        </button>
      </div>
    );
  };

  const renderSectorsEditor = () => {
    const sectorsContent = content.sectors || {
      preTitle: "NOS DOMAINES D'APPLICATION",
      title: "Secteurs d'activités",
      transport: {
        title: "Transport",
        cards: []
      },
      other: []
    };

    const updateTransportCard = (index, field, value) => {
      const newCards = [...sectorsContent.transport.cards];
      if (!newCards[index]) newCards[index] = { name: '', image: { url: '', alt: '', link: '' } };
      if (field === 'name') {
        newCards[index].name = value;
      } else {
        newCards[index].image = { ...newCards[index].image, [field]: value };
      }
      setContent(prev => ({
        ...prev,
        sectors: {
          ...sectorsContent,
          transport: { ...sectorsContent.transport, cards: newCards }
        }
      }));
    };

    const updateOtherCard = (index, field, value) => {
      const newCards = [...sectorsContent.other];
      if (!newCards[index]) newCards[index] = { name: '', image: { url: '', alt: '', link: '' } };
      if (field === 'name') {
        newCards[index].name = value;
      } else {
        newCards[index].image = { ...newCards[index].image, [field]: value };
      }
      setContent(prev => ({
        ...prev,
        sectors: { ...sectorsContent, other: newCards }
      }));
    };

    return (
      <div className="content-editor">
        <h3>Section Secteurs d'activités</h3>
        <div className="form-group">
          <label>Pré-titre:</label>
          <input
            type="text"
            value={sectorsContent.preTitle}
            onChange={(e) => setContent(prev => ({
              ...prev,
              sectors: { ...sectorsContent, preTitle: e.target.value }
            }))}
          />
        </div>
        <div className="form-group">
          <label>Titre:</label>
          <input
            type="text"
            value={sectorsContent.title}
            onChange={(e) => setContent(prev => ({
              ...prev,
              sectors: { ...sectorsContent, title: e.target.value }
            }))}
          />
        </div>

        <h4>Secteur Transport:</h4>
        <div className="form-group">
          <label>Titre du secteur transport:</label>
          <input
            type="text"
            value={sectorsContent.transport?.title || ''}
            onChange={(e) => setContent(prev => ({
              ...prev,
              sectors: {
                ...sectorsContent,
                transport: { ...sectorsContent.transport, title: e.target.value }
              }
            }))}
          />
        </div>

        {sectorsContent.transport?.cards?.map((card, index) => (
          <div key={index} className="card-editor">
            <h5>Carte Transport {index + 1}</h5>
            <div className="form-group">
              <label>Nom:</label>
              <input
                type="text"
                value={card.name || ''}
                onChange={(e) => updateTransportCard(index, 'name', e.target.value)}
              />
            </div>
            <ImageUpload
              currentImageUrl={card.image?.url || ''}
              onImageUploaded={(url) => updateTransportCard(index, 'url', url)}
              onImageRemoved={() => updateTransportCard(index, 'url', '')}
              label={`Image ${card.name || `Transport ${index + 1}`}`}
              folder="engrd/sectors/transport"
            />
            <div className="form-group">
              <label>Texte alternatif:</label>
              <input
                type="text"
                value={card.image?.alt || ''}
                onChange={(e) => updateTransportCard(index, 'alt', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Lien:</label>
              <input
                type="text"
                value={card.image?.link || ''}
                placeholder="/jobs?sector=automobile"
                onChange={(e) => updateTransportCard(index, 'link', e.target.value)}
              />
            </div>
          </div>
        ))}

        <h4>Autres Secteurs:</h4>
        {sectorsContent.other?.map((card, index) => (
          <div key={index} className="card-editor">
            <h5>Secteur {index + 1}</h5>
            <div className="form-group">
              <label>Nom:</label>
              <input
                type="text"
                value={card.name || ''}
                onChange={(e) => updateOtherCard(index, 'name', e.target.value)}
              />
            </div>
            <ImageUpload
              currentImageUrl={card.image?.url || ''}
              onImageUploaded={(url) => updateOtherCard(index, 'url', url)}
              onImageRemoved={() => updateOtherCard(index, 'url', '')}
              label={`Image ${card.name || `Secteur ${index + 1}`}`}
              folder="engrd/sectors/other"
            />
            <div className="form-group">
              <label>Texte alternatif:</label>
              <input
                type="text"
                value={card.image?.alt || ''}
                onChange={(e) => updateOtherCard(index, 'alt', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Lien:</label>
              <input
                type="text"
                value={card.image?.link || ''}
                placeholder="/jobs?sector=energie"
                onChange={(e) => updateOtherCard(index, 'link', e.target.value)}
              />
            </div>
          </div>
        ))}

        <button 
          onClick={() => saveSection('sectors', content.sectors || sectorsContent)}
          disabled={saving}
          className="btn btn-primary"
        >
          {saving ? 'Sauvegarde...' : 'Sauvegarder'}
        </button>
      </div>
    );
  };

  const renderSectionEditor = () => {
    switch (activeSection) {
      case 'hero':
        return renderHeroEditor();
      case 'about':
        return renderAboutEditor();
      case 'expertise':
        return renderExpertiseEditor();
      case 'values':
        return renderValuesEditor();
      case 'sectors':
        return renderSectorsEditor();
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="admin-main">
        <div className="loading-spinner"></div>
        <p>Chargement du contenu...</p>
      </div>
    );
  }

  return (
    <div className="admin-main">
      <div className="admin-content">
        <h1>Gestion du Contenu de la Page d'Accueil</h1>
        
        <div className="section-tabs">
          {sections.map(section => (
            <button
              key={section.key}
              className={`tab-button ${activeSection === section.key ? 'active' : ''}`}
              onClick={() => setActiveSection(section.key)}
            >
              {section.label}
            </button>
          ))}
        </div>

        {renderSectionEditor()}
      </div>
    </div>
  );
};

export default HomeContentEditor;