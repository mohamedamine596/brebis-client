import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import './Admin.css';

interface Sheep {
  id?: string;
  _id?: string;
  name: string;
  price: number;
  image?: string;
  available: boolean;
  description?: string;
  roi?: number;
  duration?: string;
}

interface Investment {
  id?: string;
  _id?: string;
  userId: string;
  userName: string;
  userEmail: string;
  sheepId: string;
  sheepName: string;
  amount: number;
  date: string;
  status: 'active' | 'completed' | 'pending';
}

interface User {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  totalInvestments: number;
  investmentCount: number;
}

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'sheep' | 'investors'>('overview');
  const [sheep, setSheep] = useState<Sheep[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddSheepModal, setShowAddSheepModal] = useState(false);
  const [editingSheep, setEditingSheep] = useState<Sheep | null>(null);
  
  // Form state for sheep
  const [sheepForm, setSheepForm] = useState({
    name: '',
    price: '',
    image: '',
    description: '',
    roi: '',
    duration: '',
    available: true
  });

  // Load data on component mount
  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          loadSheep(),
          loadInvestments(),
          loadUsers()
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadSheep = useCallback(async () => {
    try {
      const response = await api.get('/brebis');
      const responseData = response.data?.data || response.data || {};
      const data = Array.isArray(responseData) ? responseData : 
                  (Array.isArray(responseData.brebis) ? responseData.brebis : 
                  (Array.isArray(responseData.sheep) ? responseData.sheep : []));
      setSheep(data);
    } catch (error) {
      console.error('Error loading sheep:', error);
      // Mock data for development
      setSheep([
        { id: '1', name: 'Brebis A', price: 100, available: true, description: 'Brebis premium', roi: 12, duration: '12 mois' },
        { id: '2', name: 'Brebis B', price: 120, available: true, description: 'Brebis premium', roi: 12, duration: '12 mois' }
      ]);
    }
  }, []);

  const loadInvestments = useCallback(async () => {
    try {
      const response = await api.get('/admin/investments');
      setInvestments(response.data || []);
    } catch (error) {
      console.error('Error loading investments:', error);
      // Mock data for development
      setInvestments([
        { id: '1', userId: '1', userName: 'John Doe', userEmail: 'john@example.com', sheepId: '1', sheepName: 'Brebis A', amount: 100, date: '2024-01-15', status: 'active' },
        { id: '2', userId: '2', userName: 'Jane Smith', userEmail: 'jane@example.com', sheepId: '2', sheepName: 'Brebis B', amount: 120, date: '2024-01-10', status: 'active' }
      ]);
    }
  }, []);

  const loadUsers = useCallback(async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data || []);
    } catch (error) {
      console.error('Error loading users:', error);
      // Mock data for development
      setUsers([
        { id: '1', name: 'John Doe', email: 'john@example.com', totalInvestments: 100, investmentCount: 1 },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com', totalInvestments: 120, investmentCount: 1 }
      ]);
    }
  }, []);

  const handleSheepSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const sheepData = {
        ...sheepForm,
        price: parseFloat(sheepForm.price),
        roi: parseFloat(sheepForm.roi),
      };

      if (editingSheep) {
        await api.put(`/brebis/${editingSheep.id || editingSheep._id}`, sheepData);
      } else {
        await api.post('/brebis', sheepData);
      }
      
      resetSheepForm();
      loadSheep();
    } catch (error) {
      console.error('Error saving sheep:', error);
      alert('Erreur lors de la sauvegarde de la brebis');
    }
  };

  const handleDeleteSheep = async (sheepId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette brebis ?')) {
      try {
        await api.delete(`/brebis/${sheepId}`);
        loadSheep();
      } catch (error) {
        console.error('Error deleting sheep:', error);
        alert('Erreur lors de la suppression de la brebis');
      }
    }
  };

  const handleEditSheep = (sheep: Sheep) => {
    setEditingSheep(sheep);
    setSheepForm({
      name: sheep.name,
      price: sheep.price.toString(),
      image: sheep.image || '',
      description: sheep.description || '',
      roi: sheep.roi?.toString() || '',
      duration: sheep.duration || '',
      available: sheep.available
    });
    setShowAddSheepModal(true);
  };

  const resetSheepForm = () => {
    setSheepForm({
      name: '',
      price: '',
      image: '',
      description: '',
      roi: '',
      duration: '',
      available: true
    });
    setEditingSheep(null);
    setShowAddSheepModal(false);
  };

  // Calculate statistics with safety checks
  const totalInvestments = Array.isArray(investments) ? investments.reduce((sum, inv) => sum + inv.amount, 0) : 0;
  const totalInvestors = Array.isArray(users) ? users.length : 0;
  const availableSheep = Array.isArray(sheep) ? sheep.filter(s => s.available).length : 0;
  const averageInvestment = totalInvestors > 0 ? totalInvestments / totalInvestors : 0;

  if (loading) {
    return (
      <div className="admin-container">
        <div className="admin-loading">
          <div className="loading-spinner"></div>
          <p>Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      {/* Header */}
      <div className="admin-header">
        <div className="header-content">
          <h1 className="admin-title">
            <span className="title-icon">👑</span>
            Espace Administrateur
          </h1>
          <p className="admin-subtitle">Gérez vos brebis et suivez vos investisseurs</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="admin-nav">
        <button 
          className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <span className="tab-icon">📊</span>
          Vue d'ensemble
        </button>
        <button 
          className={`nav-tab ${activeTab === 'sheep' ? 'active' : ''}`}
          onClick={() => setActiveTab('sheep')}
        >
          <span className="tab-icon">🐑</span>
          Gestion des Brebis
        </button>
        <button 
          className={`nav-tab ${activeTab === 'investors' ? 'active' : ''}`}
          onClick={() => setActiveTab('investors')}
        >
          <span className="tab-icon">👥</span>
          Investisseurs
        </button>
      </div>

      {/* Content */}
      <div className="admin-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <div className="stats-grid">
              <div className="stat-card premium">
                <div className="stat-icon">💰</div>
                <div className="stat-content">
                  <h3>{totalInvestments.toLocaleString()} €</h3>
                  <p>Total Investissements</p>
                </div>
              </div>
              <div className="stat-card premium">
                <div className="stat-icon">👥</div>
                <div className="stat-content">
                  <h3>{totalInvestors}</h3>
                  <p>Investisseurs Actifs</p>
                </div>
              </div>
              <div className="stat-card premium">
                <div className="stat-icon">🐑</div>
                <div className="stat-content">
                  <h3>{availableSheep}</h3>
                  <p>Brebis Disponibles</p>
                </div>
              </div>
              <div className="stat-card premium">
                <div className="stat-icon">📈</div>
                <div className="stat-content">
                  <h3>{averageInvestment.toLocaleString()} €</h3>
                  <p>Investissement Moyen</p>
                </div>
              </div>
            </div>

            <div className="recent-activity">
              <h2>Activité Récente</h2>
              <div className="activity-list">
                {(Array.isArray(investments) ? investments : []).slice(0, 5).map((investment) => (
                  <div key={investment.id || investment._id} className="activity-item">
                    <div className="activity-icon">💎</div>
                    <div className="activity-content">
                      <h4>{investment.userName}</h4>
                      <p>A investi {investment.amount}€ dans {investment.sheepName}</p>
                      <span className="activity-date">{new Date(investment.date).toLocaleDateString()}</span>
                    </div>
                    <div className={`activity-status ${investment.status}`}>
                      {investment.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sheep' && (
          <div className="sheep-management">
            <div className="section-header">
              <h2>Gestion des Brebis</h2>
              <button 
                className="add-btn premium"
                onClick={() => setShowAddSheepModal(true)}
              >
                <span className="btn-icon">➕</span>
                Ajouter une Brebis
              </button>
            </div>

            <div className="sheep-grid">
              {(Array.isArray(sheep) ? sheep : []).map((sheepItem) => (
                <div key={sheepItem.id || sheepItem._id} className="sheep-card admin">
                  <div className="card-header">
                    <img 
                      src={sheepItem.image || '/brebishome.webp'} 
                      alt={sheepItem.name}
                      className="sheep-image"
                    />
                    <div className={`status-badge ${sheepItem.available ? 'available' : 'sold'}`}>
                      {sheepItem.available ? 'Disponible' : 'Vendue'}
                    </div>
                  </div>
                  <div className="card-content">
                    <h3>{sheepItem.name}</h3>
                    <p className="price">{sheepItem.price}€</p>
                    <p className="description">{sheepItem.description}</p>
                    <div className="sheep-details">
                      <span>ROI: {sheepItem.roi}%</span>
                      <span>Durée: {sheepItem.duration}</span>
                    </div>
                  </div>
                  <div className="card-actions">
                    <button 
                      className="edit-btn"
                      onClick={() => handleEditSheep(sheepItem)}
                    >
                      ✏️ Modifier
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteSheep(sheepItem.id || sheepItem._id!)}
                    >
                      🗑️ Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'investors' && (
          <div className="investors-section">
            <h2>Liste des Investisseurs</h2>
            <div className="investors-table">
              <div className="table-header">
                <div className="th">Investisseur</div>
                <div className="th">Email</div>
                <div className="th">Total Investi</div>
                <div className="th">Nb Investissements</div>
                <div className="th">Actions</div>
              </div>
              {(Array.isArray(users) ? users : []).map((user) => (
                <div key={user.id || user._id} className="table-row">
                  <div className="td">
                    <div className="user-info">
                      <div className="user-avatar">👤</div>
                      <span>{user.name}</span>
                    </div>
                  </div>
                  <div className="td">{user.email}</div>
                  <div className="td amount">{user.totalInvestments.toLocaleString()}€</div>
                  <div className="td">{user.investmentCount}</div>
                  <div className="td">
                    <button className="view-btn">👁️ Voir Détails</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="investments-details">
              <h3>Détails des Investissements</h3>
              <div className="investments-table">
                <div className="table-header">
                  <div className="th">Investisseur</div>
                  <div className="th">Brebis</div>
                  <div className="th">Montant</div>
                  <div className="th">Date</div>
                  <div className="th">Statut</div>
                </div>
                {(Array.isArray(investments) ? investments : []).map((investment) => (
                  <div key={investment.id || investment._id} className="table-row">
                    <div className="td">{investment.userName}</div>
                    <div className="td">{investment.sheepName}</div>
                    <div className="td amount">{investment.amount.toLocaleString()}€</div>
                    <div className="td">{new Date(investment.date).toLocaleDateString()}</div>
                    <div className="td">
                      <span className={`status-badge ${investment.status}`}>
                        {investment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Sheep Modal */}
      {showAddSheepModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingSheep ? 'Modifier la Brebis' : 'Ajouter une Brebis'}</h3>
              <button className="close-btn" onClick={resetSheepForm}>✕</button>
            </div>
            <form onSubmit={handleSheepSubmit} className="sheep-form">
              <div className="form-group">
                <label>Nom de la brebis</label>
                <input
                  type="text"
                  value={sheepForm.name}
                  onChange={(e) => setSheepForm({...sheepForm, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Prix (€)</label>
                <input
                  type="number"
                  value={sheepForm.price}
                  onChange={(e) => setSheepForm({...sheepForm, price: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>URL de l'image</label>
                <input
                  type="url"
                  value={sheepForm.image}
                  onChange={(e) => setSheepForm({...sheepForm, image: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={sheepForm.description}
                  onChange={(e) => setSheepForm({...sheepForm, description: e.target.value})}
                  rows={3}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>ROI (%)</label>
                  <input
                    type="number"
                    value={sheepForm.roi}
                    onChange={(e) => setSheepForm({...sheepForm, roi: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Durée</label>
                  <input
                    type="text"
                    value={sheepForm.duration}
                    onChange={(e) => setSheepForm({...sheepForm, duration: e.target.value})}
                    placeholder="ex: 12 mois"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={sheepForm.available}
                    onChange={(e) => setSheepForm({...sheepForm, available: e.target.checked})}
                  />
                  Disponible à l'investissement
                </label>
              </div>
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={resetSheepForm}>
                  Annuler
                </button>
                <button type="submit" className="submit-btn">
                  {editingSheep ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;