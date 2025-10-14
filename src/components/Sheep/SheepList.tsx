import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { logout, isAuthenticated } from '../../services/auth';
import './Sheep.css';

interface Sheep {
    _id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    available: boolean;
}

const SheepList: React.FC = () => {
    const [sheep, setSheep] = useState<Sheep[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login');
            return;
        }
        fetchSheep();
    }, [navigate]);

    const fetchSheep = async () => {
        try {
            const response = await api.get('/sheep');
            setSheep(response.data.sheep);
        } catch (err: any) {
            setError('Erreur lors du chargement des brebis');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
    };

    const handleInvest = (sheepId: string) => {
        navigate(`/sheep/${sheepId}/invest`);
    };

    if (loading) {
        return <div className="loading">Chargement...</div>;
    }

    return (
        <div className="sheep-container">
            <header className="sheep-header">
                <div className="header-left">
                    <img src="/brebis_logo.jpg" alt="Brebis Invest" className="logo" />
                    <h1>Brebis Invest</h1>
                </div>
                <nav className="header-nav">
                    <button onClick={() => navigate('/profile')} className="nav-btn">
                        Mon espace
                    </button>
                    <button onClick={handleLogout} className="nav-btn logout">
                        Déconnexion
                    </button>
                </nav>
            </header>

            <main className="sheep-main">
                <section className="intro-section">
                    <h2>Brebis disponibles à l'investissement</h2>
                    <p>Choisissez votre brebis et participez au projet</p>
                </section>

                {error && <div className="error-message">{error}</div>}

                <div className="sheep-grid">
                    {sheep.length === 0 ? (
                        <p className="no-sheep">Aucune brebis disponible pour le moment</p>
                    ) : (
                        sheep.map((s) => (
                            <div key={s._id} className="sheep-card">
                                <div className="sheep-image">
                                    <img src={s.imageUrl} alt={s.name} />
                                    {!s.available && (
                                        <div className="sold-badge">Vendue</div>
                                    )}
                                </div>
                                <div className="sheep-info">
                                    <h3>{s.name}</h3>
                                    <p className="description">{s.description}</p>
                                    <div className="price-section">
                                        <span className="price">{s.price} €</span>
                                        {s.available && (
                                            <button
                                                onClick={() => handleInvest(s._id)}
                                                className="invest-btn"
                                            >
                                                Investir
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
};

export default SheepList;
