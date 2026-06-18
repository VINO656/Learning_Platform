import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Search, Filter, PlayCircle, FileText, Image as ImageIcon, CheckCircle, Circle } from 'lucide-react';
import PolymorphicViewer from '../components/content/PolymorphicViewer';
import { AuthContext } from '../context/AuthContext';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const { user, toggleModule } = useContext(AuthContext);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrack, setSelectedTrack] = useState('');
  const [activeAsset, setActiveAsset] = useState(null);

  useEffect(() => {
    fetchModules();
  }, [searchTerm, selectedTrack]);

  const fetchModules = async () => {
    try {
      setLoading(true);
      let url = `${import.meta.env.VITE_API_URL}/modules`;
      const params = new URLSearchParams();
      if (searchTerm) params.append('keyword', searchTerm);
      if (selectedTrack) params.append('track', selectedTrack);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await axios.get(url);
      setModules(res.data);
    } catch (error) {
      console.error('Error fetching modules', error);
    } finally {
      setLoading(false);
    }
  };

  const tracks = ['Frontend Fundamentals', 'Backend Engineering', 'Advanced System Design', 'DevOps & CI/CD Pipelines'];

  const getAssetIcon = (type) => {
    switch(type) {
      case 'video': return <PlayCircle size={20} className="asset-icon video-icon" />;
      case 'pdf': return <FileText size={20} className="asset-icon pdf-icon" />;
      case 'image': return <ImageIcon size={20} className="asset-icon image-icon" />;
      default: return <FileText size={20} className="asset-icon" />;
    }
  };

  const completedCount = user?.completedModules?.length || 0;
  const totalCount = modules.length;
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>The Developer Lab</h1>
        <p className="subtitle">Advanced Software Engineering & Architecture Practices</p>
      </div>

      {/* Global Progress Bar */}
      <div className="progress-section glass-panel">
        <div className="progress-header">
          <h3>Your Learning Progress</h3>
          <span className="progress-text">{completedCount} of {totalCount} Modules Completed ({progressPercentage}%)</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
        </div>
      </div>

      <div className="filters-section glass-panel">
        <div className="search-box">
          <Search size={20} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search technical modules..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-box">
          <Filter size={20} className="filter-icon" />
          <select value={selectedTrack} onChange={(e) => setSelectedTrack(e.target.value)}>
            <option value="">All Tracks</option>
            {tracks.map(track => (
              <option key={track} value={track}>{track}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-screen">Loading modules...</div>
      ) : (
        <div className="modules-grid">
          {modules.length === 0 ? (
            <div className="no-modules">No modules found matching your criteria.</div>
          ) : (
            modules.map(mod => {
              const isCompleted = user?.completedModules?.includes(mod._id);
              
              return (
                <div key={mod._id} className={`module-card glass-panel ${isCompleted ? 'completed-card' : ''}`}>
                  <div className="module-header">
                    <div className="header-top">
                      <span className="track-badge">{mod.track}</span>
                      <button 
                        className={`completion-toggle ${isCompleted ? 'completed' : ''}`}
                        onClick={() => toggleModule(mod._id)}
                        title={isCompleted ? "Mark as incomplete" : "Mark as complete"}
                      >
                        {isCompleted ? <CheckCircle size={24} /> : <Circle size={24} />}
                      </button>
                    </div>
                    <h3>{mod.title}</h3>
                  </div>
                  <div className="module-body">
                    <p>{mod.description}</p>
                    <div className="instructor-info">
                      By: {mod.instructor?.name || 'Unknown Instructor'}
                    </div>
                  </div>
                  <div className="module-assets">
                    <h4>Technical Assets</h4>
                    <div className="assets-list">
                      {mod.assets.map(asset => (
                        <button 
                          key={asset._id} 
                          className="asset-btn"
                          onClick={() => setActiveAsset(asset)}
                        >
                          {getAssetIcon(asset.assetType)}
                          <span className="asset-title" title={asset.title}>
                            {asset.title.length > 20 ? asset.title.substring(0, 20) + '...' : asset.title}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Asset Viewer Modal */}
      {activeAsset && (
        <div className="modal-overlay" onClick={() => setActiveAsset(null)}>
          <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{activeAsset.title}</h3>
              <button className="close-btn" onClick={() => setActiveAsset(null)}>×</button>
            </div>
            <div className="modal-body">
              <PolymorphicViewer asset={activeAsset} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
