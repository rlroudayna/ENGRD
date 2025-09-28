// backend/seedHomeContent.js
const mongoose = require('mongoose');
const HomeContent = require('./models/HomeContent');
require('dotenv').config();

const defaultContent = {
    hero: {
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
            alt: "Équipe ENG R&D au travail",
            link: "/contact"
        }
    },
    about: {
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
    },
    expertise: {
        preTitle: "NOTRE EXPERTISE",
        title: "Vous accompagner dans vos projets",
        cards: [
            { text: "Conception" },
            { text: "Développement" },
            { text: "Qualité / HSE / sûreté de fonctionnement" },
            { text: "Soft embarqué" }
        ]
    },
    sectors: {
        preTitle: "NOS DOMAINES D'APPLICATION",
        title: "Secteurs d'activités",
        transport: {
            title: "Transport",
            cards: [
                {
                    name: "Automobile",
                    image: {
                        url: "/assets/Automobile.jpg",
                        alt: "Secteur Automobile",
                        link: "/jobs?sector=automobile"
                    }
                },
                {
                    name: "Aéronautique",
                    image: {
                        url: "/assets/Aeronautics.png",
                        alt: "Secteur Aéronautique",
                        link: "/jobs?sector=aeronautique"
                    }
                },
                {
                    name: "Ferroviaire",
                    image: {
                        url: "/assets/Ferroviaire.jpg",
                        alt: "Secteur Ferroviaire",
                        link: "/jobs?sector=ferroviaire"
                    }
                },
                {
                    name: "Spatial",
                    image: {
                        url: "/assets/Spatial.jpg",
                        alt: "Secteur Spatial",
                        link: "/jobs?sector=spatial"
                    }
                },
                {
                    name: "Militaire",
                    image: {
                        url: "/assets/Military.jpg",
                        alt: "Secteur Militaire",
                        link: "/jobs?sector=militaire"
                    }
                }
            ]
        },
        other: [
            {
                name: "Énergie",
                image: {
                    url: "/assets/Energy.png",
                    alt: "Secteur Énergie",
                    link: "/jobs?sector=energie"
                }
            },
            {
                name: "Santé",
                image: {
                    url: "/assets/Sante.jpg",
                    alt: "Secteur Santé",
                    link: "/jobs?sector=sante"
                }
            },
            {
                name: "IT",
                image: {
                    url: "/assets/IT.png",
                    alt: "Secteur IT",
                    link: "/jobs?sector=it"
                }
            }
        ]
    },
    values: {
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
    }
};

async function seedHomeContent() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing content
        await HomeContent.deleteMany({});
        console.log('Cleared existing home content');

        // Insert default content
        for (const [section, content] of Object.entries(defaultContent)) {
            await HomeContent.create({
                section,
                content
            });
            console.log(`Seeded ${section} content`);
        }

        console.log('Home content seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding home content:', error);
        process.exit(1);
    }
}

seedHomeContent();