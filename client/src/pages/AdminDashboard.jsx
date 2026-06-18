import React, { useState } from 'react';
import axios from 'axios';
import { UploadCloud, Plus } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [track, setTrack] = useState('Frontend Fundamentals');
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('track', track);
    
    files.forEach(file => {
      formData.append('assets', file);
    });

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/modules`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage('Module created successfully with assets streamed to Cloudinary.');
      setTitle('');
      setDescription('');
      setFiles([]);
    } catch (error) {
      setMessage(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="admin-container">
      <div className="dashboard-header">
        <h1>Curriculum Manager</h1>
        <p className="subtitle">Upload and manage technical assets for the developer lab.</p>
      </div>

      <div className="admin-content">
        <div className="upload-section glass-panel">
          <h2>Create Technical Module</h2>
          
          {message && (
            <div className={`status-message ${message.startsWith('Error') ? 'error' : 'success'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="upload-form">
            <div className="form-group">
              <label>Module Title</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required 
                placeholder="e.g. Microservices Architecture Deep Dive"
              />
            </div>

            <div className="form-group">
              <label>Technical Description</label>
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                required 
                placeholder="Detail the technical concepts covered..."
                rows={4}
              />
            </div>

            <div className="form-group">
              <label>Career Track</label>
              <select value={track} onChange={(e) => setTrack(e.target.value)}>
                <option value="Frontend Fundamentals">Frontend Fundamentals</option>
                <option value="Backend Engineering">Backend Engineering</option>
                <option value="Advanced System Design">Advanced System Design</option>
                <option value="DevOps & CI/CD Pipelines">DevOps & CI/CD Pipelines</option>
              </select>
            </div>

            <div className="form-group file-upload-group">
              <label>Developer Assets (PDFs, Images, MP4s)</label>
              <div className="file-input-wrapper">
                <input 
                  type="file" 
                  multiple 
                  onChange={handleFileChange} 
                  accept=".pdf,image/*,video/mp4"
                  id="file-upload"
                  className="file-input"
                />
                <label htmlFor="file-upload" className="file-input-label">
                  <UploadCloud size={30} className="upload-icon" />
                  <span>Choose files or drag & drop</span>
                  <span className="file-hint">Max 5 files (PDF, JPG, PNG, MP4)</span>
                </label>
              </div>
              
              {files.length > 0 && (
                <div className="selected-files">
                  <h4>Selected Files:</h4>
                  <ul>
                    {files.map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <button type="submit" className="btn-primary submit-btn" disabled={uploading}>
              {uploading ? (
                <>Uploading Assets...</>
              ) : (
                <><Plus size={18} /> Create Module & Stream to Cloud</>
              )}
            </button>
          </form>
        </div>
        
        <div className="admin-sidebar glass-panel">
          <h2>Admin Capabilities</h2>
          <ul className="capabilities-list">
            <li><strong>Secure Uploads:</strong> Files stream directly to Cloudinary via Multer.</li>
            <li><strong>Polymorphic Content:</strong> System handles PDFs, Images, and MP4s natively.</li>
            <li><strong>RBAC:</strong> This route is protected by <code>&lt;AdminRoute&gt;</code> and verified on the server.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
