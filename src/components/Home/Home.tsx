import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <header className="home-header">
                <div className="logo-container">
                    <img src="/brebis_logo.jpg" alt="Brebis Invest" className="logo" />
                    <h1>Brebis Invest</h1>
                </div>
                <nav>
                    <button onClick={() => navigate('/login')} className="btn-secondary">
                        Se connecter
                    </button>
                </nav>
            </header>

            <main className="home-main">
                <section className="hero-section">
                    <div className="hero-content">
                        <h2>Investissez simplement dans l'élevage de brebis</h2>
                        <p className="hero-description">
                            Chaque brebis représente une part réelle du cheptel.
                            Participez à un projet agricole durable et rentable.
                        </p>
                        <button onClick={() => navigate('/register')} className="btn-primary">
                            Je commence à investir
                        </button>
                    </div>
                    <div className="hero-image">
                        <img src="/brebishome.webp" alt="Ferme de brebis" />
                    </div>
                </section>

                <section className="features-section">
                    <div className="feature">
                        <div className="feature-icon">🐑</div>
                        <h3>Investissement Simple</h3>
                        <p>Achetez des brebis en quelques clics, dès 100€</p>
                    </div>
                    <div className="feature">
                        <div className="feature-icon">💰</div>
                        <h3>Rendement Attractif</h3>
                        <p>Profitez des revenus générés par l'élevage</p>
                    </div>
                    <div className="feature">
                        <div className="feature-icon">🔒</div>
                        <h3>Sécurisé</h3>
                        <p>Paiements sécurisés et transparence totale</p>
                    </div>
                    <div className="feature">
                        <div className="feature-icon">🌱</div>
                        <h3>Durable</h3>
                        <p>Soutenez une agriculture responsable</p>
                    </div>
                </section>

                <section className="cta-section">
                    <h2>Prêt à commencer ?</h2>
                    <p>Rejoignez nos investisseurs et participez à l'aventure Brebis Invest</p>
                    <button onClick={() => navigate('/register')} className="btn-primary large">
                        Créer mon compte gratuitement
                    </button>
                </section>
            </main>

            <footer className="home-footer">
                <p>&copy; 2025 Brebis Invest. Tous droits réservés.</p>
            </footer>
        </div>
    );
};

export default Home;
