import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { isAdmin } from '../../services/auth';
import './Sheep.css';

interface Sheep {
  id?: string;
  _id?: string;
  name: string;
  price?: number;
  image?: string;
  available?: boolean;
  description?: string;
  roi?: number;
  duration?: string;
}

const SheepList: React.FC = () => {
  // initialize as empty array (prevents reading .length on undefined)
  const [sheep, setSheep] = useState<Sheep[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.get('/brebis');
        // Handle the response structure from the backend
        const responseData = res?.data?.data || res?.data || {};
        const list = Array.isArray(responseData) ? responseData : 
                    (Array.isArray(responseData.brebis) ? responseData.brebis : 
                    (Array.isArray(responseData.sheep) ? responseData.sheep : []));
        if (mounted) setSheep(list);
      } catch (err) {
        console.error(err);
        if (mounted) setError('Failed to load sheep');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const handleInvest = (sheepId: string) => {
    // TODO: Implement investment logic
    console.log('Investing in sheep:', sheepId);
  };

  if (loading) {
    return (
      <div className="sheep-container">
        <div className="sheep-loading">
          <div className="loading-spinner"></div>
          <p>Chargement des brebis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sheep-container">
        <div className="sheep-error">
          <div className="error-icon">⚠️</div>
          <h3>Erreur de chargement</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-btn">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!sheep || sheep.length === 0) {
    return (
      <div className="sheep-container">
        <div className="sheep-empty">
          <div className="empty-icon">🐑</div>
          <h3>Aucune brebis disponible</h3>
          <p>Les brebis arrivent bientôt ! Revenez plus tard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sheep-container">
      <div className="sheep-header-section">
        <div className="header-background"></div>
        <div className="header-content">
          <h1 className="page-title">
            <span className="title-icon">🐑</span>
            Nos Brebis d'Investissement
          </h1>
          <p className="page-subtitle">
            Découvrez nos brebis premium et investissez dans l'avenir de l'élevage
          </p>
          {isAdmin() && (
            <div className="admin-link-container">
              <Link to="/admin/dashboard" className="admin-link">
                <span className="admin-icon">👑</span>
                Espace Administrateur
              </Link>
            </div>
          )}
        </div>
      </div>
      
      <div className="sheep-main">
        <div className="sheep-stats">
          <div className="stat-card">
            <h3>{sheep.length}</h3>
            <p>Brebis disponibles</p>
          </div>
          <div className="stat-card">
            <h3>{sheep.filter(s => s.available !== false).length}</h3>
            <p>En stock</p>
          </div>
          <div className="stat-card">
            <h3>12%</h3>
            <p>ROI moyen</p>
          </div>
        </div>

        <div className="sheep-grid">
          {sheep.map((s, index) => (
            <div 
              key={s.id ?? s._id} 
              className="sheep-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="card-header">
                <div className="sheep-image">
                  <img src={s.image ?? '/brebishome.webp'} alt={s.name} />
                  <div className="image-overlay"></div>
                  {s.available === false && <div className="sold-badge">Vendu</div>}
                  <div className="availability-badge">
                    {s.available !== false ? 'Disponible' : 'Indisponible'}
                  </div>
                </div>
              </div>
              
              <div className="card-body">
                <h3 className="sheep-name">{s.name}</h3>
                <p className="sheep-description">
                  {s.description || 'Brebis de qualité premium, idéale pour l\'investissement agricole durable.'}
                </p>
                
                <div className="sheep-features">
                  <div className="feature">
                    <span className="feature-icon">💰</span>
                    <span className="feature-text">ROI: {s.roi || '12'}%</span>
                  </div>
                  <div className="feature">
                    <span className="feature-icon">⏱️</span>
                    <span className="feature-text">Durée: {s.duration || '12 mois'}</span>
                  </div>
                  <div className="feature">
                    <span className="feature-icon">🏆</span>
                    <span className="feature-text">Qualité Premium</span>
                  </div>
                </div>
              </div>
              
              <div className="card-footer">
                <div className="price-section">
                  <div className="price-label">Prix d'investissement</div>
                  <div className="price">{s.price ? `${s.price} €` : 'Prix sur demande'}</div>
                </div>
                <button 
                  className={`invest-btn ${s.available === false ? 'disabled' : ''}`}
                  onClick={() => s.available !== false && handleInvest(s.id ?? s._id!)}
                  disabled={s.available === false}
                >
                  {s.available === false ? 'Indisponible' : 'Investir Maintenant'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SheepList;
