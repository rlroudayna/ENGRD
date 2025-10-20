import { useState, useEffect } from 'react';
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
    { key: 'hero', label: 'Section Héro', icon: '🎬' },
    { key: 'about', label: 'Qui sommes-nous', icon: '👥' },
    { key: 'expertise', label: 'Notre Expertise', icon: '🚀' },
    { key: 'sectors', label: 'Secteurs d\'activités', icon: '🏭' },
    { key: 'values', label: 'Nos Valeurs', icon: '💎' }
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
      title: "Bienvenue chez ENG RND",
      subtitle: "Votre partenaire en ingénierie automobile, expert en systèmes embarqués, modélisation et validation.",
      presentationTitle: "Votre partenaire en ingénierie automobile",
      presentationText1: "Depuis 2018 à Casablanca, ENG RND propose des solutions de modélisation, simulation et logiciels embarqués.",
      presentationText2: "Nous engageons performance, innovation et qualité dans tous nos projets.",
      heroVideo: {
        url: "/assets/hero-video.mp4",
        alt: "Vidéo de présentation ENG RND"
      },
      teamworkImage: {
        url: "/assets/teamwork.jpg",
        alt: "Image équipe ENG RND au travail",
        link: "/contact"
      }
    };

    return (
      <div className="content-editor">
        <div className="editor-section">
          <h3 className="section-title">🎬 Section Héro</h3>
          
          <div className="form-grid">
            <div className="form-group">
              <label>Titre principal:</label>
              <input
                type="text"
                className="form-input"
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
                className="form-textarea"
                rows="3"
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
                className="form-input"
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
                className="form-textarea"
                rows="3"
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
                className="form-textarea"
                rows="3"
                value={heroContent.presentationText2}
                onChange={(e) => setContent(prev => ({
                  ...prev,
                  hero: { ...heroContent, presentationText2: e.target.value }
                }))}
              />
            </div>
          </div>
        </div>
        
        <div className="editor-section">
          <h4 className="section-subtitle">📸 Images et Médias</h4>
          
          <div className="media-grid">
            <div className="media-card">
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
            </div>
            
            <div className="media-card">
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
                folder="engrnd/teamwork"
              />
            </div>
          </div>
        </div>
        
        <div className="editor-actions">
          <button 
            onClick={() => saveSection('hero', content.hero || heroContent)}
            disabled={saving}
            className="btn btn-primary"
          >
            {saving ? (
              <>
                <div className="btn-spinner"></div>
                Sauvegarde...
              </>
            ) : (
              <>
                💾 Sauvegarder
              </>
            )}
          </button>
        </div>
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
        <div className="editor-section">
          <h3 className="section-title">👥 Section Qui sommes-nous</h3>
          
          <div className="form-grid">
            <div className="form-group">
              <label>Titre:</label>
              <input
                type="text"
                className="form-input"
                value={aboutContent.title}
                onChange={(e) => setContent(prev => ({
                  ...prev,
                  about: { ...aboutContent, title: e.target.value }
                }))}
              />
            </div>
            
            <div className="form-group full-width">
              <label>Description:</label>
              <textarea
                className="form-textarea"
                rows="4"
                value={aboutContent.description}
                onChange={(e) => setContent(prev => ({
                  ...prev,
                  about: { ...aboutContent, description: e.target.value }
                }))}
              />
            </div>
          </div>
        </div>

        <div className="editor-section">
          <h4 className="section-subtitle">🎯 Cartes de présentation</h4>
          
          <div className="cards-grid">
            {aboutContent.cards.map((card, index) => (
              <div key={index} className="card-editor">
                <div className="card-editor-header">
                  <span className="card-number">Carte {index + 1}</span>
                </div>
                
                <div className="form-group">
                  <label>Icône:</label>
                  <input
                    type="text"
                    className="form-input"
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
                    className="form-input"
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
                    className="form-textarea"
                    rows="3"
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
          </div>
        </div>
        
        <div className="editor-actions">
          <button 
            onClick={() => saveSection('about', content.about || aboutContent)}
            disabled={saving}
            className="btn btn-primary"
          >
            {saving ? (
              <>
                <div className="btn-spinner"></div>
                Sauvegarde...
              </>
            ) : (
              <>
                💾 Sauvegarder
              </>
            )}
          </button>
        </div>
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
        <div className="editor-section">
          <h3 className="section-title">🚀 Section Notre Expertise</h3>
          
          <div className="form-grid">
            <div className="form-group">
              <label>Pré-titre:</label>
              <input
                type="text"
                className="form-input"
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
                className="form-input"
                value={expertiseContent.title}
                onChange={(e) => setContent(prev => ({
                  ...prev,
                  expertise: { ...expertiseContent, title: e.target.value }
                }))}
              />
            </div>
          </div>
        </div>

        <div className="editor-section">
          <h4 className="section-subtitle">⚡ Cartes d'expertise</h4>
          
          <div className="expertise-grid">
            {expertiseContent.cards.map((card, index) => (
              <div key={index} className="expertise-card">
                <div className="expertise-card-header">
                  <span className="expertise-number">{index + 1}</span>
                  <span className="expertise-label">Expertise {index + 1}</span>
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Nom de l'expertise"
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
              </div>
            ))}
          </div>
        </div>
        
        <div className="editor-actions">
          <button 
            onClick={() => saveSection('expertise', content.expertise || expertiseContent)}
            disabled={saving}
            className="btn btn-primary"
          >
            {saving ? (
              <>
                <div className="btn-spinner"></div>
                Sauvegarde...
              </>
            ) : (
              <>
                💾 Sauvegarder
              </>
            )}
          </button>
        </div>
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
        <div className="editor-section">
          <h3 className="section-title">💎 Section Nos Valeurs</h3>
          
          <div className="form-grid">
            <div className="form-group">
              <label>Titre:</label>
              <input
                type="text"
                className="form-input"
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
                className="form-input"
                value={valuesContent.subtitle}
                onChange={(e) => setContent(prev => ({
                  ...prev,
                  values: { ...valuesContent, subtitle: e.target.value }
                }))}
              />
            </div>
            
            <div className="form-group full-width">
              <label>Description:</label>
              <textarea
                className="form-textarea"
                rows="4"
                value={valuesContent.description}
                onChange={(e) => setContent(prev => ({
                  ...prev,
                  values: { ...valuesContent, description: e.target.value }
                }))}
              />
            </div>
          </div>
        </div>

        <div className="editor-section">
          <h4 className="section-subtitle">🌟 Cartes de valeurs</h4>
          
          <div className="values-grid">
            {valuesContent.cards.map((card, index) => (
              <div key={index} className="value-card">
                <div className="value-card-header">
                  <span className="value-icon">🏆</span>
                  <span className="value-label">Valeur {index + 1}</span>
                </div>
                
                <div className="form-group">
                  <label>Titre:</label>
                  <input
                    type="text"
                    className="form-input"
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
                    className="form-textarea"
                    rows="3"
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
          </div>
        </div>
        
        <div className="editor-actions">
          <button 
            onClick={() => saveSection('values', content.values || valuesContent)}
            disabled={saving}
            className="btn btn-primary"
          >
            {saving ? (
              <>
                <div className="btn-spinner"></div>
                Sauvegarde...
              </>
            ) : (
              <>
                💾 Sauvegarder
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  const renderSectorsEditor = () => {
    const sectorsContent = content.sectors || {
      preTitle: "NOS DOMAINES D'APPLICATION",
      title: "Secteurs d'activités",
      transport: {
        title: "Transport",
        cards: [
          { name: "Automobile", image: { url: "/assets/Automobile.jpg", alt: "Automobile", link: "/jobs?sector=automobile" } },
          { name: "Aéronautique", image: { url: "/assets/Aeronautics.png", alt: "Aéronautique", link: "/jobs?sector=aeronautique" } },
          { name: "Ferroviaire", image: { url: "/assets/Ferroviaire.jpg", alt: "Ferroviaire", link: "/jobs?sector=ferroviaire" } },
          { name: "Spatial", image: { url: "/assets/Spatial.jpg", alt: "Spatial", link: "/jobs?sector=spatial" } },
          { name: "Militaire", image: { url: "/assets/Military.jpg", alt: "Militaire", link: "/jobs?sector=militaire" } }
        ]
      },
      other: [
        { name: "Énergie", image: { url: "/assets/Energy.png", alt: "Énergie", link: "/jobs?sector=energie" } },
        { name: "Santé", image: { url: "/assets/Sante.jpg", alt: "Santé", link: "/jobs?sector=sante" } },
        { name: "IT", image: { url: "/assets/IT.png", alt: "IT", link: "/jobs?sector=it" } },
        { name: "RH", image: { url: "/assets/RH.png", alt: "Ressources Humaines", link: "/jobs?sector=rh" } },
        { name: "Marketing", image: { url: "/assets/Marketing.png", alt: "Marketing", link: "/jobs?sector=marketing" } },
        { name: "Finance", image: { url: "/assets/Finance.png", alt: "Finance", link: "/jobs?sector=finance" } },
        { name: "Commercial", image: { url: "/assets/Commercial.png", alt: "Commercial", link: "/jobs?sector=commercial" } },
        { name: "Communication", image: { url: "/assets/Communication.png", alt: "Communication", link: "/jobs?sector=communication" } },
        { name: "Juridique", image: { url: "/assets/Juridique.png", alt: "Juridique", link: "/jobs?sector=juridique" } },
        { name: "Qualité", image: { url: "/assets/Quality.png", alt: "Qualité", link: "/jobs?sector=qualite" } },
        { name: "Logistique", image: { url: "/assets/Logistique.png", alt: "Logistique", link: "/jobs?sector=logistique" } },
        { name: "Production", image: { url: "/assets/Production.png", alt: "Production", link: "/jobs?sector=production" } },
        { name: "R&D", image: { url: "/assets/RD.png", alt: "Recherche et Développement", link: "/jobs?sector=rd" } },
        { name: "Consulting", image: { url: "/assets/Consulting.png", alt: "Conseil", link: "/jobs?sector=consulting" } },
        { name: "Formation", image: { url: "/assets/Formation.png", alt: "Formation", link: "/jobs?sector=formation" } }
      ]
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
        <div className="editor-section">
          <h3 className="section-title">🏭 Section Secteurs d'activités</h3>
          
          <div className="form-grid">
            <div className="form-group">
              <label>Pré-titre:</label>
              <input
                type="text"
                className="form-input"
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
                className="form-input"
                value={sectorsContent.title}
                onChange={(e) => setContent(prev => ({
                  ...prev,
                  sectors: { ...sectorsContent, title: e.target.value }
                }))}
              />
            </div>
          </div>
        </div>

        <div className="editor-section">
          <h4 className="section-subtitle">🚗 Secteur Transport</h4>
          
          <div className="form-group">
            <label>Titre du secteur transport:</label>
            <input
              type="text"
              className="form-input"
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

          <div className="sectors-grid">
            {sectorsContent.transport?.cards?.map((card, index) => (
              <div key={index} className="sector-card">
                <div className="sector-card-header">
                  <span className="sector-icon">🚗</span>
                  <span className="sector-label">{card.name || `Transport ${index + 1}`}</span>
                </div>
                
                <div className="form-group">
                  <label>Nom:</label>
                  <input
                    type="text"
                    className="form-input"
                    value={card.name || ''}
                    onChange={(e) => updateTransportCard(index, 'name', e.target.value)}
                  />
                </div>
                
                <div className="image-upload-container">
                  <ImageUpload
                    currentImageUrl={card.image?.url || ''}
                    onImageUploaded={(url) => updateTransportCard(index, 'url', url)}
                    onImageRemoved={() => updateTransportCard(index, 'url', '')}
                    label={`Image ${card.name || `Transport ${index + 1}`}`}
                    folder="engrnd/sectors/transport"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="editor-section">
          <h4 className="section-subtitle">🌐 Autres Secteurs</h4>
          
          <div className="sectors-grid">
            {sectorsContent.other?.map((card, index) => (
              <div key={index} className="sector-card">
                <div className="sector-card-header">
                  <span className="sector-icon">🏢</span>
                  <span className="sector-label">{card.name || `Secteur ${index + 1}`}</span>
                </div>
                
                <div className="form-group">
                  <label>Nom:</label>
                  <input
                    type="text"
                    className="form-input"
                    value={card.name || ''}
                    onChange={(e) => updateOtherCard(index, 'name', e.target.value)}
                  />
                </div>
                
                <div className="image-upload-container">
                  <ImageUpload
                    currentImageUrl={card.image?.url || ''}
                    onImageUploaded={(url) => updateOtherCard(index, 'url', url)}
                    onImageRemoved={() => updateOtherCard(index, 'url', '')}
                    label={`Image ${card.name || `Secteur ${index + 1}`}`}
                    folder="engrnd/sectors/other"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="editor-actions">
          <button 
            onClick={() => saveSection('sectors', content.sectors || sectorsContent)}
            disabled={saving}
            className="btn btn-primary"
          >
            {saving ? (
              <>
                <div className="btn-spinner"></div>
                Sauvegarde...
              </>
            ) : (
              <>
                💾 Sauvegarder
              </>
            )}
          </button>
        </div>
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
        <div className="admin-header">
          <div className="admin-header-content">
            <h1 className="admin-title">
              <span className="admin-icon">🏠</span>
              Gestion du Contenu
            </h1>
            <p className="admin-subtitle">
              Modification du contenu de la page d'accueil
            </p>
          </div>
        </div>
        <div className="admin-content">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Chargement du contenu...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-main">
      <div className="admin-header">
        <div className="admin-header-content">
          <h1 className="admin-title">
            <span className="admin-icon">🏠</span>
            Gestion du Contenu
          </h1>
          <p className="admin-subtitle">
            Modification du contenu de la page d'accueil
          </p>
        </div>
        <div className="admin-header-stats">
          <div className="stat-card">
            <div className="stat-number">{Object.keys(content).length}</div>
            <div className="stat-label">Sections configurées</div>
          </div>
        </div>
      </div>

      <div className="admin-content">
        <div className="section-tabs">
          {sections.map(section => (
            <button
              key={section.key}
              className={`tab-button ${activeSection === section.key ? 'active' : ''}`}
              onClick={() => setActiveSection(section.key)}
            >
              <span className="tab-icon">{section.icon}</span>
              <span className="tab-label">{section.label}</span>
            </button>
          ))}
        </div>

        <div className="content-editor-container">
          {renderSectionEditor()}
        </div>
      </div>
    </div>
  );
};

export default HomeContentEditor;