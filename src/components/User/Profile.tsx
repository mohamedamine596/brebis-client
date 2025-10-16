import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { logout, getUser } from '../../services/auth';
import './Profile.css';

interface Sheep {
    _id: string;
    name: string;
    price: number;
    imageUrl: string;
}

interface UserSheep {
    sheepId: Sheep;
    purchaseDate: string;
    amount: number;
}

interface Payment {
    _id: string;
    amount: number;
    status: string;
    createdAt: string;
    sheepId: Sheep;
}

const Profile: React.FC = () => {
    const [sheep, setSheep] = useState<UserSheep[]>([]);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const user = getUser();

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const [userResponse, paymentsResponse] = await Promise.all([
                api.get('/auth/me'),
                api.get('/payment/history'),
            ]);

            setSheep(userResponse.data.user?.sheep || []);
            setPayments(paymentsResponse.data.payments || []);
        } catch (err: any) {
            setError('Erreur lors du chargement des données');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) {
        return <div className="loading">Chargement...</div>;
    }

    return (
        <div className="profile-container">
            <header className="profile-header">
                <div className="header-left">
                    <img src="/brebis_logo.jpg" alt="Brebis Invest" className="logo" />
                    <h1>Brebis Invest</h1>
                </div>
                <nav className="header-nav">
                    <button onClick={() => navigate('/sheep')} className="nav-btn">
                        Investir
                    </button>
                    <button onClick={handleLogout} className="nav-btn logout">
                        Déconnexion
                    </button>
                </nav>
            </header>

            <main className="profile-main">
                <div className="profile-welcome">
                    <h2>Bienvenue, {user?.name || 'Investisseur'} !</h2>
                    <p>Voici votre tableau de bord d'investissement</p>
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">🐑</div>
                        <div className="stat-content">
                            <h3>Brebis possédées</h3>
                            <p className="stat-value">{sheep.length}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">💰</div>
                        <div className="stat-content">
                            <h3>Total investi</h3>
                            <p className="stat-value">
                                {sheep.reduce((sum, s) => sum + s.amount, 0)} €
                            </p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">📊</div>
                        <div className="stat-content">
                            <h3>Transactions</h3>
                            <p className="stat-value">{payments.length}</p>
                        </div>
                    </div>
                </div>

                <section className="profile-section">
                    <div className="section-header">
                        <h3>Mes Brebis</h3>
                        <button onClick={() => navigate('/sheep')} className="btn-primary">
                            + Ajouter une brebis
                        </button>
                    </div>
                    {sheep.length === 0 ? (
                        <div className="empty-state">
                            <p>Vous n'avez pas encore de brebis.</p>
                            <button onClick={() => navigate('/sheep')} className="btn-primary">
                                Commencer à investir
                            </button>
                        </div>
                    ) : (
                        <div className="sheep-list">
                            {sheep.map((s, index) => (
                                <div key={index} className="sheep-item">
                                    <img src={s.sheepId.imageUrl} alt={s.sheepId.name} />
                                    <div className="sheep-details">
                                        <h4>{s.sheepId.name}</h4>
                                        <p className="purchase-date">
                                            Acheté le {new Date(s.purchaseDate).toLocaleDateString('fr-FR')}
                                        </p>
                                        <p className="sheep-price">{s.amount} €</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <section className="profile-section">
                    <h3>Historique des transactions</h3>
                    {payments.length === 0 ? (
                        <p className="no-data">Aucune transaction pour le moment</p>
                    ) : (
                        <div className="transactions-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Brebis</th>
                                        <th>Montant</th>
                                        <th>Statut</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payments.map((payment) => (
                                        <tr key={payment._id}>
                                            <td>{new Date(payment.createdAt).toLocaleDateString('fr-FR')}</td>
                                            <td>{payment.sheepId?.name || 'N/A'}</td>
                                            <td>{payment.amount} €</td>
                                            <td>
                                                <span className={`status ${payment.status}`}>
                                                    {payment.status === 'completed' ? 'Complété' : payment.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default Profile;
